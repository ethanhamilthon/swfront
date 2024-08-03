import { sql } from "drizzle-orm";
import { text, sqliteTable, int } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  full_name: text("full_name"),
  email: text("email").notNull().unique(),
  avatar: text("avatar"),
  language: text("language"),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  role: text("role").default("free"),
});

export const wordTable = sqliteTable("words", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  from_language: text("from_language"),
  to_language: text("to_language"),
  type: text("type"),
  is_deleted: int("is_deleted").default(0),
  user_id: text("user_id").references(() => userTable.id),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const languageTable = sqliteTable("languages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  user_id: text("user_id").references(() => userTable.id),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const pointTable = sqliteTable("points", {
  id: text("id").primaryKey(),
  point: int("point").default(0),
  user_id: text("user_id")
    .unique()
    .references(() => userTable.id),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("last_updated").default(sql`CURRENT_TIMESTAMP`),
});

export const eventTable = sqliteTable("events", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  value: text("value"),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const guestWordsTable = sqliteTable("guest_word", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  fromLanguage: text("from_language"),
  toLanguage: text("to_language"),
  guestID: text("guest_id"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
