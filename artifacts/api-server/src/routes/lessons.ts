import { Router } from "express";
import rateLimit from "express-rate-limit";
import { db, lessonsTable, chaptersTable, coursesTable, quizQuestionsTable, userProgressTable, usersTable, subscriptionsTable, activityLogTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import { XP_TO_LEVEL } from "../lib/auth";
import { executeCode } from "../lib/codeExecutor";

const router = Router();

// Stricter rate limit specifically for code execution: 60 runs per 10 minutes per IP
const executeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 60,
  message: { error: "Too many code execution requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/lessons/:id", async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const userId = (req as any).session?.userId;

  const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, id)).limit(1);
  if (!lesson) { res.status(404).json({ error: "Lesson not found" }); return; }

  const [chapter] = await db.select().from(chaptersTable).where(eq(chaptersTable.id, lesson.chapterId)).limit(1);
  if (!chapter) { res.status(404).json({ error: "Chapter not found" }); return; }
  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, chapter.courseId)).limit(1);
  if (!course) { res.status(404).json({ error: "Course not found" }); return; }

  // Access check: free lessons are open to all; paid lessons require subscription (admins bypass)
  if (!lesson.isFree) {
    if (!userId) {
      res.status(403).json({ error: "Login required" });
      return;
    }
    const [user] = await db.select({ role: usersTable.role })
      .from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (user?.role !== "admin") {
      const [sub] = await db.select().from(subscriptionsTable)
        .where(and(eq(subscriptionsTable.userId, userId), eq(subscriptionsTable.courseId, course.id), eq(subscriptionsTable.status, "active")))
        .limit(1);
      if (!sub) {
        res.status(403).json({ error: "Subscription required to access this lesson" });
        return;
      }
    }
  }

  const quizQuestions = await db.select().from(quizQuestionsTable)
    .where(eq(quizQuestionsTable.lessonId, id))
    .orderBy(quizQuestionsTable.order);

  let isCompleted = false;
  if (userId) {
    const [progress] = await db.select().from(userProgressTable)
      .where(and(eq(userProgressTable.userId, userId), eq(userProgressTable.lessonId, id))).limit(1);
    isCompleted = !!progress;
  }

  res.json({
    ...lesson,
    chapterId: chapter.id,
    courseSlug: course.slug,
    isCompleted,
    audioUrlAr: lesson.audioUrlAr,
    audioUrlEn: lesson.audioUrlEn,
    quizQuestions: quizQuestions.map(q => {
      // options are stored as jsonb: Array<{ id: string; textAr: string; textEn: string }>
      const rawOptions = (q.options as unknown as any[]) || [];
      return {
        id: q.id,
        questionAr: q.questionAr,
        questionEn: q.questionEn,
        correctOptionId: q.correctOptionId,
        xpReward: q.xpReward,
        options: rawOptions.map((opt, idx) => {
          if (typeof opt === 'string') {
            return {
              id: String(idx),
              textAr: opt,
              textEn: opt,
            };
          }
          return opt;
        }),
      };
    }),
  });
});

router.post("/lessons/:id/complete", requireAuth, async (req, res) => {
  const id = parseInt(String(req.params.id));
  const userId = req.session.userId!;

  const [existing] = await db.select().from(userProgressTable)
    .where(and(eq(userProgressTable.userId, userId), eq(userProgressTable.lessonId, id))).limit(1);
  if (existing) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (!user) { res.status(401).json({ error: "User not found" }); return; }
    res.json({ xpEarned: 0, totalXp: user.xp, leveledUp: false, newLevel: user.level, streakUpdated: false, newStreak: user.streak });
    return;
  }

  const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, id)).limit(1);
  if (!lesson) { res.status(404).json({ error: "Lesson not found" }); return; }

  await db.insert(userProgressTable).values({ userId, lessonId: id, xpEarned: lesson.xpReward, passed: true });

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (!user) { res.status(401).json({ error: "User not found" }); return; }
  const newXp = user.xp + lesson.xpReward;
  const oldLevel = user.level;
  const newLevel = XP_TO_LEVEL(newXp);

  // Streak update
  const today = new Date().toISOString().split("T")[0];
  const lastDate = user.lastActivityDate;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  let newStreak = user.streak;
  let streakUpdated = false;
  if (lastDate !== today) {
    if (lastDate === yesterday) {
      newStreak = user.streak + 1;
    } else {
      newStreak = 1;
    }
    streakUpdated = true;
  }
  const newLongest = Math.max(user.longestStreak, newStreak);

  await db.update(usersTable).set({
    xp: newXp,
    level: newLevel,
    streak: newStreak,
    longestStreak: newLongest,
    lastActivityDate: today,
    updatedAt: new Date(),
  }).where(eq(usersTable.id, userId));

  await db.insert(activityLogTable).values({
    userId,
    type: "lesson_complete",
    titleAr: `أكملت درس: ${lesson.titleAr}`,
    titleEn: `Completed lesson: ${lesson.titleEn}`,
    xpEarned: lesson.xpReward,
  });

  res.json({ xpEarned: lesson.xpReward, totalXp: newXp, leveledUp: newLevel > oldLevel, newLevel, streakUpdated, newStreak });
});

router.post("/lessons/:id/execute", executeLimiter, async (req, res) => {
  const { code, language } = req.body;
  if (!code || !language) {
    res.status(400).json({ error: "code and language are required" });
    return;
  }
  if (typeof code !== "string" || code.length > 100_000) {
    res.status(400).json({ error: "Code must be a string of at most 100,000 characters" });
    return;
  }

  try {
    const result = await executeCode(language, code);
    res.json(result);
  } catch (e: unknown) {
    res.status(500).json({ success: false, output: "", error: String(e), executionTime: 0 });
  }
});

export default router;
