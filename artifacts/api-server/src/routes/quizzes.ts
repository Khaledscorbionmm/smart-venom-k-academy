import { Router } from "express";
import { db, quizQuestionsTable, userProgressTable, usersTable, activityLogTable, lessonsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, XP_TO_LEVEL } from "../lib/auth";

const router = Router();

router.post("/quizzes/:lessonId/submit", requireAuth, async (req, res) => {
  const lessonId = parseInt(String(req.params.lessonId));
  const userId = req.session.userId!;
  const { answers } = req.body;

  if (!answers || !Array.isArray(answers)) {
    res.status(400).json({ error: "answers array is required" });
    return;
  }

  const questions = await db.select().from(quizQuestionsTable).where(eq(quizQuestionsTable.lessonId, lessonId));
  if (questions.length === 0) {
    res.status(404).json({ error: "No quiz questions for this lesson" });
    return;
  }

  let correctAnswers = 0;
  let xpEarned = 0;
  const results = questions.map(q => {
    const answer = answers.find((a: { questionId: number; selectedOptionId: string }) => a.questionId === q.id);
    const isCorrect = answer?.selectedOptionId === q.correctOptionId;
    if (isCorrect) {
      correctAnswers++;
      xpEarned += q.xpReward;
    }
    return {
      questionId: q.id,
      isCorrect,
      correctOptionId: q.correctOptionId,
      explanationAr: q.explanationAr,
      explanationEn: q.explanationEn,
    };
  });

  // score = number of correct answers (what the frontend expects for display: score/totalQuestions)
  const score = correctAnswers;
  const percentage = Math.round((correctAnswers / questions.length) * 100);
  const passed = percentage >= 60;

  // Update user XP
  if (xpEarned > 0) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (user) {
      const newXp = user.xp + xpEarned;
      const newLevel = XP_TO_LEVEL(newXp);
      await db.update(usersTable).set({ xp: newXp, level: newLevel, updatedAt: new Date() }).where(eq(usersTable.id, userId));

      const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, lessonId)).limit(1);
      await db.insert(activityLogTable).values({
        userId,
        type: "quiz_complete",
        titleAr: `أجبت على اختبار: ${lesson?.titleAr || ""}`,
        titleEn: `Completed quiz: ${lesson?.titleEn || ""}`,
        xpEarned,
      });
    }
  }

  // Update progress record if passed and already exists
  if (passed) {
    const [existing] = await db.select().from(userProgressTable)
      .where(and(eq(userProgressTable.userId, userId), eq(userProgressTable.lessonId, lessonId))).limit(1);
    if (existing) {
      await db.update(userProgressTable).set({ quizScore: percentage, passed }).where(eq(userProgressTable.id, existing.id));
    }
  }

  res.json({ score, totalQuestions: questions.length, correctAnswers, xpEarned, percentage, results });
});

export default router;
