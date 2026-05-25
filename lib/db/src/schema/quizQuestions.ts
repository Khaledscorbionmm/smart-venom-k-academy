import { pgTable, serial, text, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { lessonsTable } from "./lessons";

export const quizQuestionsTable = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessonsTable.id, { onDelete: "cascade" }),
  questionAr: text("question_ar").notNull(),
  questionEn: text("question_en").notNull(),
  options: jsonb("options").notNull().$type<Array<{ id: string; textAr: string; textEn: string }>>(),
  correctOptionId: text("correct_option_id").notNull(),
  explanationAr: text("explanation_ar"),
  explanationEn: text("explanation_en"),
  xpReward: integer("xp_reward").notNull().default(20),
  order: integer("order").notNull().default(0),
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestionsTable).omit({ id: true });
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type QuizQuestion = typeof quizQuestionsTable.$inferSelect;
