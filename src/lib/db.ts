import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const appNotification = pgTable("app_notification", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  href: text("href"),
  actorName: text("actorName"),
  isRead: boolean("isRead").notNull().default(false),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
});

export const db = process.env.DATABASE_URL
  ? drizzle(new Pool({ connectionString: process.env.DATABASE_URL }), { schema: { appNotification } })
  : null;

export type NotificationType = "view" | "like" | "guestnote" | "system";
export type AppNotification = typeof appNotification.$inferSelect;
