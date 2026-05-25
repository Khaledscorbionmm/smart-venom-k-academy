import { Router } from "express";
import { db, usersTable, coursesTable, lessonsTable, subscriptionsTable } from "@workspace/db";
import { eq, count, sql, and } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";

const router = Router();

router.get("/admin/users", requireAdmin, async (req, res) => {
  const users = await db.select().from(usersTable).orderBy(usersTable.createdAt);
  res.json(users.map(u => {
    const { passwordHash: _ph, ...safe } = u;
    return { ...safe, createdAt: safe.createdAt.toISOString() };
  }));
});

router.patch("/admin/users/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id));
  const { role, xp, level } = req.body;
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (role) updates.role = role;
  if (xp !== undefined) updates.xp = xp;
  if (level !== undefined) updates.level = level;
  const [user] = await db.update(usersTable).set(updates).where(eq(usersTable.id, id)).returning();
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  const { passwordHash: _ph, ...safe } = user;
  res.json({ ...safe, createdAt: safe.createdAt.toISOString() });
});

router.get("/admin/stats", requireAdmin, async (req, res) => {
  const [totalUsersResult] = await db.select({ count: count() }).from(usersTable);
  const [totalCoursesResult] = await db.select({ count: count() }).from(coursesTable);
  const [totalLessonsResult] = await db.select({ count: count() }).from(lessonsTable);
  const [totalSubsResult] = await db.select({ count: count() }).from(subscriptionsTable);
  const [pendingSubsResult] = await db.select({ count: count() }).from(subscriptionsTable).where(eq(subscriptionsTable.status, "pending"));
  const [activeSubsResult] = await db.select({ count: count() }).from(subscriptionsTable).where(eq(subscriptionsTable.status, "active"));
  const [totalXpResult] = await db.select({ total: sql<number>`COALESCE(SUM(xp), 0)` }).from(usersTable);

  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
  const [recentSignupsResult] = await db.select({ count: count() }).from(usersTable).where(sql`created_at >= ${sevenDaysAgo}`);

  res.json({
    totalUsers: Number(totalUsersResult.count),
    totalCourses: Number(totalCoursesResult.count),
    totalLessons: Number(totalLessonsResult.count),
    totalSubscriptions: Number(totalSubsResult.count),
    pendingSubscriptions: Number(pendingSubsResult.count),
    activeSubscriptions: Number(activeSubsResult.count),
    totalXpAwarded: Number(totalXpResult.total),
    recentSignups: Number(recentSignupsResult.count),
  });
});

export default router;
