import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const achievementsTable = pgTable("achievements", {
  id: serial("id").primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  descriptionAr: text("description_ar").notNull(),
  descriptionEn: text("description_en").notNull(),
  icon: text("icon").notNull().default("🏆"),
  xpRequired: integer("xp_required").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const userAchievementsTable = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  achievementId: integer("achievement_id").notNull().references(() => achievementsTable.id, { onDelete: "cascade" }),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

export const insertAchievementSchema = createInsertSchema(achievementsTable).omit({ id: true });
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievementsTable.$inferSelect;
export type UserAchievement = typeof userAchievementsTable.$inferSelect;
