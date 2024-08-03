"use server";

import { db } from "@/db";
import { wordTable } from "@/db/schema";
import { Auth } from "@/utils/server/check-token";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function DeleteWord(id: string) {
  const user = await Auth();
  await db
    .update(wordTable)
    .set({
      is_deleted: 1,
    })
    .where(and(eq(wordTable.id, id), eq(wordTable.user_id, user.id)));

  revalidatePath("/app");
}
