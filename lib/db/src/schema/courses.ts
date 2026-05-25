import { pgTable, serial, text, integer, boolean, numeric, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const categoryEnum = pgEnum("category", ["programming", "human_language"]);

export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  descriptionAr: text("description_ar"),
  descriptionEn: text("description_en"),
  language: text("language").notNull(),
  category: categoryEnum("category").notNull().default("programming"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
  icon: text("icon").notNull().default("💻"),
  color: text("color").notNull().default("#6366f1"),
  isFreeTrialAvailable: boolean("is_free_trial_available").notNull().default(true),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertCourseSchema = createInsertSchema(coursesTable).omit({ id: true });
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof coursesTable.$inferSelect;
