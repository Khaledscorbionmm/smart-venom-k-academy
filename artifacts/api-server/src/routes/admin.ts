import { Router } from "express";
import { db, usersTable, coursesTable, lessonsTable, subscriptionsTable, userLoginsTable } from "@workspace/db";
import { eq, count, sql, and, desc } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";

const router = Router();

function safeUser(u: typeof usersTable.$inferSelect) {
  const { passwordHash: _ph, ...safe } = u;
  return {
    ...safe,
    createdAt: safe.createdAt.toISOString(),
    updatedAt: safe.updatedAt.toISOString(),
    lastLoginAt: safe.lastLoginAt?.toISOString() || null,
  };
}

router.get("/admin/users", requireAdmin, async (req, res) => {
  const users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
  // Login counts per user
  const loginCounts = await db
    .select({ userId: userLoginsTable.userId, count: count() })
    .from(userLoginsTable)
    .groupBy(userLoginsTable.userId);
  const countMap = new Map(loginCounts.map(c => [c.userId, Number(c.count)]));
  res.json(users.map(u => ({ ...safeUser(u), loginCount: countMap.get(u.id) || 0 })));
});

router.get("/admin/users/:id/logins", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id));
  const logins = await db.select().from(userLoginsTable)
    .where(eq(userLoginsTable.userId, id))
    .orderBy(desc(userLoginsTable.createdAt));
  res.json(logins.map(l => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
  })));
});

router.delete("/admin/users/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (req.session.userId === id) {
    res.status(400).json({ error: "Cannot delete your own account" });
    return;
  }
  const [deleted] = await db.delete(usersTable).where(eq(usersTable.id, id)).returning();
  if (!deleted) { res.status(404).json({ error: "User not found" }); return; }
  res.json({ success: true });
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
  const loginCounts = await db.select({ count: count() }).from(userLoginsTable).where(eq(userLoginsTable.userId, id));
  res.json({ ...safeUser(user), loginCount: Number(loginCounts[0]?.count || 0) });
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
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [recentSignupsResult] = await db.select({ count: count() }).from(usersTable).where(sql`created_at >= ${sevenDaysAgo}`);
  const [todaySignupsResult] = await db.select({ count: count() }).from(usersTable).where(sql`created_at >= ${todayStart}`);

  // Recent login count (last 24h)
  const oneDayAgo = new Date(Date.now() - 86400000);
  const [todayLoginsResult] = await db.select({ count: count() }).from(userLoginsTable).where(sql`created_at >= ${oneDayAgo}`);

  res.json({
    totalUsers: Number(totalUsersResult.count),
    totalCourses: Number(totalCoursesResult.count),
    totalLessons: Number(totalLessonsResult.count),
    totalSubscriptions: Number(totalSubsResult.count),
    pendingSubscriptions: Number(pendingSubsResult.count),
    activeSubscriptions: Number(activeSubsResult.count),
    totalXpAwarded: Number(totalXpResult.total),
    recentSignups: Number(recentSignupsResult.count),
    todaySignups: Number(todaySignupsResult.count),
    todayLogins: Number(todayLoginsResult.count),
  });
});

export default router;
