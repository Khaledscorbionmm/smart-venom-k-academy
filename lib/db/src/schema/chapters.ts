import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { coursesTable } from "./courses";

export const chaptersTable = pgTable("chapters", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  descriptionAr: text("description_ar"),
  descriptionEn: text("description_en"),
  order: integer("order").notNull().default(0),
});

export const insertChapterSchema = createInsertSchema(chaptersTable).omit({ id: true });
export type InsertChapter = z.infer<typeof insertChapterSchema>;
export type Chapter = typeof chaptersTable.$inferSelect;
