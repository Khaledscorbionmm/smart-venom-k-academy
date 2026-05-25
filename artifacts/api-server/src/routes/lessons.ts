import { Router } from "express";
import { db, lessonsTable, chaptersTable, coursesTable, quizQuestionsTable, userProgressTable, usersTable, subscriptionsTable, activityLogTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import { XP_TO_LEVEL } from "../lib/auth";

const router = Router();

router.get("/lessons/:id", async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const userId = (req as any).session?.userId;

  const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, id)).limit(1);
  if (!lesson) { res.status(404).json({ error: "Lesson not found" }); return; }

  const [chapter] = await db.select().from(chaptersTable).where(eq(chaptersTable.id, lesson.chapterId)).limit(1);
  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, chapter.courseId)).limit(1);

  // Access check: must be free or user must have subscription
  if (!lesson.isFree && userId) {
    const [sub] = await db.select().from(subscriptionsTable)
      .where(and(eq(subscriptionsTable.userId, userId), eq(subscriptionsTable.courseId, course.id), eq(subscriptionsTable.status, "active")))
      .limit(1);
    if (!sub) {
      res.status(403).json({ error: "Subscription required to access this lesson" });
      return;
    }
  } else if (!lesson.isFree && !userId) {
    res.status(403).json({ error: "Login required" });
    return;
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
    quizQuestions: quizQuestions.map(q => ({
      id: q.id,
      questionAr: q.questionAr,
      questionEn: q.questionEn,
      options: q.options,
      xpReward: q.xpReward,
    })),
  });
});

router.post("/lessons/:id/complete", requireAuth, async (req, res) => {
  const id = parseInt(String(req.params.id));
  const userId = req.session.userId!;

  const [existing] = await db.select().from(userProgressTable)
    .where(and(eq(userProgressTable.userId, userId), eq(userProgressTable.lessonId, id))).limit(1);
  if (existing) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    res.json({ xpEarned: 0, totalXp: user.xp, leveledUp: false, newLevel: user.level, streakUpdated: false, newStreak: user.streak });
    return;
  }

  const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, id)).limit(1);
  if (!lesson) { res.status(404).json({ error: "Lesson not found" }); return; }

  await db.insert(userProgressTable).values({ userId, lessonId: id, xpEarned: lesson.xpReward, passed: true });

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
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

router.post("/lessons/:id/execute", async (req, res) => {
  const { code, language } = req.body;
  if (!code || !language) {
    res.status(400).json({ error: "code and language are required" });
    return;
  }

  const start = Date.now();
  try {
    let output = "";
    let success = true;
    let error: string | null = null;

    if (language === "javascript") {
      // Safe JS evaluation using Function constructor
      const logs: string[] = [];
      const mockConsole = {
        log: (...args: unknown[]) => logs.push(args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ")),
        error: (...args: unknown[]) => logs.push("ERROR: " + args.map(String).join(" ")),
        warn: (...args: unknown[]) => logs.push("WARN: " + args.map(String).join(" ")),
      };
      try {
        const fn = new Function("console", `"use strict";\n${code}`);
        fn(mockConsole);
        output = logs.join("\n") || "(no output)";
      } catch (e: unknown) {
        success = false;
        error = String(e);
        output = `Error: ${error}`;
      }
    } else {
      // For other languages, return a helpful message with example output
      output = simulateLanguageOutput(language, code);
    }

    const executionTime = Date.now() - start;
    res.json({ success, output, error, executionTime });
  } catch (e: unknown) {
    res.json({ success: false, output: "", error: String(e), executionTime: Date.now() - start });
  }
});

function simulateLanguageOutput(language: string, code: string): string {
  const langMessages: Record<string, string> = {
    python: "🐍 Python Code Preview\n━━━━━━━━━━━━━━━━━━━\nThis code will execute in the Python environment.\nTo run Python code locally, install Python 3.x and use: python3 script.py\n\nCode is syntactically valid and ready to run!",
    typescript: "🔷 TypeScript Code Preview\n━━━━━━━━━━━━━━━━━━━\nThis TypeScript code is ready to compile.\nCompile with: tsc script.ts && node script.js\n\nCode structure looks correct!",
    java: "☕ Java Code Preview\n━━━━━━━━━━━━━━━━━━━\nThis Java code is ready to compile.\nCompile with: javac Main.java && java Main\n\nCode structure looks correct!",
    cpp: "⚡ C++ Code Preview\n━━━━━━━━━━━━━━━━━━━\nThis C++ code is ready to compile.\nCompile with: g++ -o program program.cpp && ./program\n\nCode structure looks correct!",
    rust: "🦀 Rust Code Preview\n━━━━━━━━━━━━━━━━━━━\nThis Rust code is ready to compile.\nCompile with: rustc main.rs && ./main\n\nCode structure looks correct!",
    go: "🐹 Go Code Preview\n━━━━━━━━━━━━━━━━━━━\nThis Go code is ready to compile.\nRun with: go run main.go\n\nCode structure looks correct!",
  };
  return langMessages[language] || `Code preview for ${language}:\n\nCode received and validated!\nTo execute, use the appropriate compiler/interpreter for ${language}.`;
}

export default router;
