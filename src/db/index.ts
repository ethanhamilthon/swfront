import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

export const sqlite = new Database(process.env.SQLITE_PATH);
export const db = drizzle(sqlite);
migrate(db, { migrationsFolder: "./drizzle" });
