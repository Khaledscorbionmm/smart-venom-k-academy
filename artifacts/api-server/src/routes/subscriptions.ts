import { Router } from "express";
import { db, subscriptionsTable, coursesTable, usersTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../lib/auth";

const router = Router();

const fmt = (s: any) => ({
  ...s,
  createdAt: s.createdAt instanceof Date ? s.createdAt.toISOString() : s.createdAt,
  approvedAt: s.approvedAt instanceof Date ? s.approvedAt.toISOString() : (s.approvedAt || null),
});

const subFields = {
  id: subscriptionsTable.id,
  userId: subscriptionsTable.userId,
  courseId: subscriptionsTable.courseId,
  status: subscriptionsTable.status,
  createdAt: subscriptionsTable.createdAt,
  approvedAt: subscriptionsTable.approvedAt,
  approvedBy: subscriptionsTable.approvedBy,
  courseSlug: coursesTable.slug,
  courseTitleAr: coursesTable.titleAr,
  courseTitleEn: coursesTable.titleEn,
  userEmail: usersTable.email,
  username: usersTable.username,
};

router.get("/subscriptions", requireAuth, async (req, res) => {
  const userId = req.session.userId!;
  const isAdmin = req.session.role === "admin";

  const subs = await db
    .select(subFields)
    .from(subscriptionsTable)
    .leftJoin(coursesTable, eq(coursesTable.id, subscriptionsTable.courseId))
    .leftJoin(usersTable, eq(usersTable.id, subscriptionsTable.userId))
    .where(isAdmin ? undefined : eq(subscriptionsTable.userId, userId))
    .orderBy(desc(subscriptionsTable.createdAt));

  res.json(subs.map(fmt));
});

router.post("/subscriptions", requireAuth, async (req, res) => {
  const userId = req.session.userId!;
  const { courseId } = req.body;

  if (!courseId) {
    res.status(400).json({ error: "courseId is required" });
    return;
  }

  const [existing] = await db
    .select()
    .from(subscriptionsTable)
    .where(and(eq(subscriptionsTable.userId, userId), eq(subscriptionsTable.courseId, courseId)))
    .limit(1);

  if (existing) {
    res.status(400).json({ error: "Already subscribed or request pending" });
    return;
  }

  const [sub] = await db
    .insert(subscriptionsTable)
    .values({ userId, courseId, status: "pending" })
    .returning();

  res.status(201).json(fmt(sub));
});

router.patch("/subscriptions/:id/approve", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id));
  const [sub] = await db
    .update(subscriptionsTable)
    .set({ status: "active", approvedAt: new Date(), approvedBy: req.session.userId })
    .where(eq(subscriptionsTable.id, id))
    .returning();
  if (!sub) { res.status(404).json({ error: "Not found" }); return; }
  res.json(fmt(sub));
});

router.patch("/subscriptions/:id/reject", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id));
  const [sub] = await db
    .update(subscriptionsTable)
    .set({ status: "rejected" })
    .where(eq(subscriptionsTable.id, id))
    .returning();
  if (!sub) { res.status(404).json({ error: "Not found" }); return; }
  res.json(fmt(sub));
});

router.patch("/subscriptions/:id/suspend", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id));
  const [sub] = await db
    .update(subscriptionsTable)
    .set({ status: "suspended" })
    .where(eq(subscriptionsTable.id, id))
    .returning();
  if (!sub) { res.status(404).json({ error: "Not found" }); return; }
  res.json(fmt(sub));
});

router.patch("/subscriptions/:id/reactivate", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id));
  const [sub] = await db
    .update(subscriptionsTable)
    .set({ status: "active", approvedAt: new Date(), approvedBy: req.session.userId })
    .where(eq(subscriptionsTable.id, id))
    .returning();
  if (!sub) { res.status(404).json({ error: "Not found" }); return; }
  res.json(fmt(sub));
});

export default router;
