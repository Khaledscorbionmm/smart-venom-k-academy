import { Router } from "express";
import { db, usersTable, userProgressTable, lessonsTable, chaptersTable, coursesTable, activityLogTable, achievementsTable, userAchievementsTable } from "@workspace/db";
import { eq, desc, count, sql, and } from "drizzle-orm";
import { requireAuth } from "../lib/auth";

const router = Router();

router.get("/users/me/dashboard", requireAuth, async (req, res) => {
  const userId = req.session.userId!;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (!user) { res.status(401).json({ error: "User not found" }); return; }

  const completedProgress = await db.select({ lessonId: userProgressTable.lessonId, xpEarned: userProgressTable.xpEarned, createdAt: userProgressTable.completedAt })
    .from(userProgressTable).where(eq(userProgressTable.userId, userId));

  const completedLessonIds = new Set(completedProgress.map(p => p.lessonId));
  const passedQuizzes = completedProgress.filter(p => p.xpEarned > 50).length;

  const totalLessons = await db.select({ count: count() }).from(lessonsTable);
  const totalLessonsCount = totalLessons[0]?.count || 0;

  // Language stats per course
  const courses = await db.select({
    id: coursesTable.id, slug: coursesTable.slug, titleAr: coursesTable.titleAr, titleEn: coursesTable.titleEn,
    icon: coursesTable.icon, color: coursesTable.color,
  }).from(coursesTable).where(eq(coursesTable.isActive, true)).orderBy(coursesTable.sortOrder);

  const languageStats = await Promise.all(courses.slice(0, 8).map(async course => {
    const courseLessons = await db.select({ id: lessonsTable.id }).from(lessonsTable)
      .innerJoin(chaptersTable, eq(chaptersTable.id, lessonsTable.chapterId))
      .where(eq(chaptersTable.courseId, course.id));
    const courseLessonIds = courseLessons.map(l => l.id);
    const completedInCourse = courseLessonIds.filter(id => completedLessonIds.has(id)).length;
    const xpEarned = completedProgress.filter(p => courseLessonIds.includes(p.lessonId)).reduce((s, p) => s + p.xpEarned, 0);
    return {
      courseSlug: course.slug,
      titleAr: course.titleAr,
      titleEn: course.titleEn,
      icon: course.icon,
      color: course.color,
      completedLessons: completedInCourse,
      totalLessons: courseLessonIds.length,
      xpEarned,
    };
  }));

  // Recent activity
  const recentActivity = await db.select().from(activityLogTable)
    .where(eq(activityLogTable.userId, userId))
    .orderBy(desc(activityLogTable.createdAt)).limit(10);

  // Weekly XP
  const weeklyXp = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(Date.now() - i * 86400000);
    const dayStr = day.toISOString().split("T")[0];
    const xpForDay = completedProgress.filter(p => p.createdAt.toISOString().split("T")[0] === dayStr).reduce((s, p) => s + p.xpEarned, 0);
    weeklyXp.push({ day: day.toLocaleDateString("ar-EG", { weekday: "short" }), xp: xpForDay });
  }

  const { passwordHash: _ph, ...safeUser } = user;
  res.json({
    user: { ...safeUser, createdAt: safeUser.createdAt.toISOString() },
    completedLessons: completedLessonIds.size,
    totalLessons: Number(totalLessonsCount),
    passedQuizzes,
    codeExecutions: 0,
    languageStats,
    recentActivity: recentActivity.map(a => ({ ...a, createdAt: a.createdAt.toISOString() })),
    weeklyXp,
  });
});

router.get("/users/me/progress", requireAuth, async (req, res) => {
  const userId = req.session.userId!;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

  const completedProgress = await db.select({ lessonId: userProgressTable.lessonId, xpEarned: userProgressTable.xpEarned })
    .from(userProgressTable).where(eq(userProgressTable.userId, userId));
  const completedLessonIds = new Set(completedProgress.map(p => p.lessonId));

  const totalLessons = await db.select({ count: count() }).from(lessonsTable);

  const courses = await db.select().from(coursesTable).where(eq(coursesTable.isActive, true)).orderBy(coursesTable.sortOrder);

  const courseProgress = await Promise.all(courses.map(async course => {
    const courseLessons = await db.select({ id: lessonsTable.id }).from(lessonsTable)
      .innerJoin(chaptersTable, eq(chaptersTable.id, lessonsTable.chapterId))
      .where(eq(chaptersTable.courseId, course.id));
    const completedInCourse = courseLessons.filter(l => completedLessonIds.has(l.id)).length;
    const total = courseLessons.length;
    return {
      courseSlug: course.slug,
      titleAr: course.titleAr,
      titleEn: course.titleEn,
      icon: course.icon,
      color: course.color,
      completedLessons: completedInCourse,
      totalLessons: total,
      percentage: total > 0 ? Math.round((completedInCourse / total) * 100) : 0,
    };
  }));

  res.json({
    totalXp: user.xp,
    level: user.level,
    streak: user.streak,
    completedLessons: completedLessonIds.size,
    totalLessons: Number(totalLessons[0]?.count || 0),
    courseProgress,
  });
});

router.get("/users/me/achievements", requireAuth, async (req, res) => {
  const userId = req.session.userId!;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

  const allAchievements = await db.select().from(achievementsTable).orderBy(achievementsTable.sortOrder);
  const userAchievements = await db.select().from(userAchievementsTable).where(eq(userAchievementsTable.userId, userId));
  const earnedIds = new Set(userAchievements.map(ua => ua.achievementId));

  // Auto-award XP-based achievements
  for (const achievement of allAchievements) {
    if (user.xp >= achievement.xpRequired && !earnedIds.has(achievement.id)) {
      await db.insert(userAchievementsTable).values({ userId, achievementId: achievement.id }).catch(() => {});
      earnedIds.add(achievement.id);
    }
  }

  const userAchievementsUpdated = await db.select().from(userAchievementsTable).where(eq(userAchievementsTable.userId, userId));
  const earnedMap = new Map(userAchievementsUpdated.map(ua => [ua.achievementId, ua.earnedAt]));

  res.json(allAchievements.map(a => ({
    id: a.id,
    nameAr: a.nameAr,
    nameEn: a.nameEn,
    descriptionAr: a.descriptionAr,
    descriptionEn: a.descriptionEn,
    icon: a.icon,
    xpRequired: a.xpRequired,
    isEarned: earnedMap.has(a.id),
    earnedAt: earnedMap.get(a.id)?.toISOString() || null,
  })));
});

router.get("/users/me/streak", async (req, res) => {
  const userId = (req as any).session?.userId;
  if (!userId) {
    res.json({ currentStreak: 0, longestStreak: 0, lastActivityDate: null });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (!user) { res.json({ currentStreak: 0, longestStreak: 0, lastActivityDate: null }); return; }
  res.json({ currentStreak: user.streak, longestStreak: user.longestStreak, lastActivityDate: user.lastActivityDate });
});

export default router;
