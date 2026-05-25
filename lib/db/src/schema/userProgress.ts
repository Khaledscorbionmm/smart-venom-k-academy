import { pgTable, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { lessonsTable } from "./lessons";

export const userProgressTable = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  lessonId: integer("lesson_id").notNull().references(() => lessonsTable.id, { onDelete: "cascade" }),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  xpEarned: integer("xp_earned").notNull().default(0),
  quizScore: integer("quiz_score"),
  passed: boolean("passed").notNull().default(false),
});

export const insertUserProgressSchema = createInsertSchema(userProgressTable).omit({ id: true });
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgressTable.$inferSelect;
