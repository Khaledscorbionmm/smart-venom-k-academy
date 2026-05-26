import { pgTable, serial, text, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { chaptersTable } from "./chapters";

export const lessonsTable = pgTable("lessons", {
  id: serial("id").primaryKey(),
  chapterId: integer("chapter_id").notNull().references(() => chaptersTable.id, { onDelete: "cascade" }),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  contentAr: text("content_ar").notNull().default(""),
  contentEn: text("content_en").notNull().default(""),
  codeExample: text("code_example"),
  language: text("language").notNull().default("python"),
  videoUrlAr: text("video_url_ar"),
  videoUrlEn: text("video_url_en"),
  audioUrlAr: text("audio_url_ar"),
  audioUrlEn: text("audio_url_en"),
  xpReward: integer("xp_reward").notNull().default(50),
  order: integer("order").notNull().default(0),
  isFree: boolean("is_free").notNull().default(false),
});

export const insertLessonSchema = createInsertSchema(lessonsTable).omit({ id: true });
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessonsTable.$inferSelect;
