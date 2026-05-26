import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const userLoginsTable = pgTable("user_logins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  ipAddress: text("ip_address"),
  location: text("location"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserLoginSchema = createInsertSchema(userLoginsTable).omit({ id: true, createdAt: true });
export type InsertUserLogin = z.infer<typeof insertUserLoginSchema>;
export type UserLogin = typeof userLoginsTable.$inferSelect;
