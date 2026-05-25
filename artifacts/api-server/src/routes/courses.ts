import { Router } from "express";
import { db, coursesTable, chaptersTable, lessonsTable, userProgressTable, subscriptionsTable, usersTable } from "@workspace/db";
import { eq, and, count, sql } from "drizzle-orm";

const router = Router();

router.get("/courses", async (req, res) => {
  const { category } = req.query;
  const query = db.select({
    id: coursesTable.id,
    slug: coursesTable.slug,
    titleAr: coursesTable.titleAr,
    titleEn: coursesTable.titleEn,
    descriptionAr: coursesTable.descriptionAr,
    descriptionEn: coursesTable.descriptionEn,
    language: coursesTable.language,
    category: coursesTable.category,
    price: coursesTable.price,
    icon: coursesTable.icon,
    color: coursesTable.color,
    isFreeTrialAvailable: coursesTable.isFreeTrialAvailable,
    totalChapters: sql<number>`(SELECT COUNT(*) FROM chapters WHERE chapters.course_id = courses.id)`,
    totalLessons: sql<number>`(SELECT COUNT(*) FROM lessons l JOIN chapters c ON l.chapter_id = c.id WHERE c.course_id = courses.id)`,
  }).from(coursesTable).where(eq(coursesTable.isActive, true)).orderBy(coursesTable.sortOrder);

  const courses = await query;
  let result = courses;
  if (category) result = courses.filter(c => c.category === category);
  res.json(result.map(c => ({ ...c, price: parseFloat(c.price as unknown as string) })));
});

router.get("/courses/featured", async (req, res) => {
  const courses = await db.select({
    id: coursesTable.id,
    slug: coursesTable.slug,
    titleAr: coursesTable.titleAr,
    titleEn: coursesTable.titleEn,
    language: coursesTable.language,
    category: coursesTable.category,
    price: coursesTable.price,
    icon: coursesTable.icon,
    color: coursesTable.color,
    isFreeTrialAvailable: coursesTable.isFreeTrialAvailable,
    totalChapters: sql<number>`(SELECT COUNT(*) FROM chapters WHERE chapters.course_id = courses.id)`,
    totalLessons: sql<number>`(SELECT COUNT(*) FROM lessons l JOIN chapters c ON l.chapter_id = c.id WHERE c.course_id = courses.id)`,
    enrolledCount: sql<number>`(SELECT COUNT(*) FROM subscriptions WHERE subscriptions.course_id = courses.id AND subscriptions.status = 'active')`,
  }).from(coursesTable).where(eq(coursesTable.isActive, true)).orderBy(coursesTable.sortOrder).limit(10);
  res.json(courses.map(c => ({ ...c, price: parseFloat(c.price as unknown as string) })));
});

router.get("/courses/:slug", async (req, res) => {
  const { slug } = req.params;
  const userId = (req as any).session?.userId;

  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.slug, slug)).limit(1);
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }

  const chapters = await db.select().from(chaptersTable).where(eq(chaptersTable.courseId, course.id)).orderBy(chaptersTable.order);

  let hasAccess = false;
  if (userId) {
    const [userRow] = await db.select({ role: usersTable.role })
      .from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (userRow?.role === "admin") {
      hasAccess = true; // admins bypass subscription
    } else {
      const [sub] = await db.select().from(subscriptionsTable)
        .where(and(eq(subscriptionsTable.userId, userId), eq(subscriptionsTable.courseId, course.id), eq(subscriptionsTable.status, "active")))
        .limit(1);
      hasAccess = !!sub;
    }
  }

  let completedLessonIds: number[] = [];
  let userXpEarned = 0;
  if (userId) {
    const progress = await db.select({ lessonId: userProgressTable.lessonId, xpEarned: userProgressTable.xpEarned })
      .from(userProgressTable).where(eq(userProgressTable.userId, userId));
    completedLessonIds = progress.map(p => p.lessonId);
    userXpEarned = progress.reduce((sum, p) => sum + p.xpEarned, 0);
  }

  const chaptersWithLessons = await Promise.all(chapters.map(async (ch) => {
    const lessons = await db.select({
      id: lessonsTable.id,
      titleAr: lessonsTable.titleAr,
      titleEn: lessonsTable.titleEn,
      order: lessonsTable.order,
      isFree: lessonsTable.isFree,
      xpReward: lessonsTable.xpReward,
      videoUrlAr: lessonsTable.videoUrlAr,
      videoUrlEn: lessonsTable.videoUrlEn,
    }).from(lessonsTable).where(eq(lessonsTable.chapterId, ch.id)).orderBy(lessonsTable.order);

    return {
      ...ch,
      lessons: lessons.map(l => ({
        ...l,
        isCompleted: completedLessonIds.includes(l.id),
        hasVideo: !!(l.videoUrlAr || l.videoUrlEn),
      })),
    };
  }));

  const totalLessons = chaptersWithLessons.reduce((s, ch) => s + ch.lessons.length, 0);

  res.json({
    ...course,
    price: parseFloat(course.price as unknown as string),
    hasAccess,
    userXpEarned,
    totalLessons,
    totalChapters: chapters.length,
    chapters: chaptersWithLessons,
  });
});

export default router;
