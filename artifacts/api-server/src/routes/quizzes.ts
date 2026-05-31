import { Router } from "express";
  import { db, quizQuestionsTable, userProgressTable, usersTable, activityLogTable, lessonsTable } from "@workspace/db";
  import { eq, and } from "drizzle-orm";
  import { requireAuth, XP_TO_LEVEL } from "../lib/auth";

  const router = Router();

  // GET /quizzes/:lessonId - Get quiz questions for a lesson
  router.get("/quizzes/:lessonId", async (req, res) => {
    const lessonId = parseInt(String(req.params.lessonId));
    if (isNaN(lessonId)) {
      res.status(400).json({ error: "Invalid lessonId" });
      return;
    }

    const questions = await db.select().from(quizQuestionsTable)
      .where(eq(quizQuestionsTable.lessonId, lessonId))
      .orderBy(quizQuestionsTable.order);

    const formattedQuestions = questions.map(q => {
      const rawOptions = (q.options as unknown as any[]) || [];
      return {
        id: q.id,
        questionAr: q.questionAr,
        questionEn: q.questionEn,
        correctOptionId: q.correctOptionId,
        xpReward: q.xpReward,
        explanationAr: q.explanationAr,
        explanationEn: q.explanationEn,
        options: rawOptions.map((opt: any, idx: number) => {
          if (typeof opt === "string") {
            return { id: String(idx), textAr: opt, textEn: opt };
          }
          return opt;
        }),
      };
    });

    res.json({ questions: formattedQuestions, total: formattedQuestions.length });
  });

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

    const score = correctAnswers;
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    const passed = percentage >= 60;

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

    if (passed) {
      const [existing] = await db.select().from(userProgressTable)
        .where(and(eq(userProgressTable.userId, userId), eq(userProgressTable.lessonId, lessonId))).limit(1);
      if (existing) {
        await db.update(userProgressTable).set({ quizScore: percentage, passed }).where(eq(userProgressTable.id, existing.id));
      } else {
        await db.insert(userProgressTable).values({
          userId,
          lessonId,
          xpEarned: xpEarned,
          quizScore: percentage,
          passed,
        });
      }
    }

    res.json({ score, totalQuestions: questions.length, correctAnswers, xpEarned, percentage, passed, results });
  });

  export default router;
  