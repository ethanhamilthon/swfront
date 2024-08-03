"use server";

import { db } from "@/db";
import { wordTable } from "@/db/schema";
import { Auth } from "@/utils/server/check-token";
import { and, desc, eq, like } from "drizzle-orm";

export async function SearchResultsAction(prefix: string) {
  const result = await Auth();
  const words = await db
    .select()
    .from(wordTable)
    .where(
      and(like(wordTable.title, prefix + "%"), eq(wordTable.user_id, result.id))
    );
  return words;
}

export async function GetMoreWords(
  currentCount: number,
  targetLanguage: string,
  limit: number
) {
  const user = await Auth();
  const words = await db
    .select()
    .from(wordTable)
    .where(
      and(
        eq(wordTable.user_id, user.id),
        eq(wordTable.is_deleted, 0),
        eq(wordTable.to_language, targetLanguage)
      )
    )
    .orderBy(desc(wordTable.created_at))
    .limit(limit)
    .offset(currentCount);
  return words;
}
