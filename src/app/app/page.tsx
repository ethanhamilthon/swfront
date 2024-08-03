import { db } from "@/db";
import { wordTable } from "@/db/schema";
import { HomePage } from "@/feature/home";
import { Auth } from "@/utils/server/check-token";
import { and, desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await Auth();
  const words = await Promise.all(
    user.targets.map(async (targetlaguage) => {
      const targetWords = await db
        .select()
        .from(wordTable)
        .where(
          and(
            eq(wordTable.user_id, user.id),
            eq(wordTable.is_deleted, 0),
            eq(wordTable.to_language, targetlaguage)
          )
        )
        .orderBy(desc(wordTable.created_at))
        .limit(10);
      return {
        language: targetlaguage,
        words: targetWords,
      };
    })
  );
  return <HomePage words={words} />;
}
