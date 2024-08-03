import { db } from "@/db";
import { wordTable } from "@/db/schema";
import { Repeat } from "@/feature/repeat";
import { Auth } from "@/utils/server/check-token";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export default async function RepeatPage({
  searchParams,
}: {
  searchParams?: { count?: string; language?: string };
}) {
  const count = searchParams?.count;
  const lang = searchParams?.language;
  if (!count || !lang || isNaN(Number(count))) {
    redirect("/app");
  }
  const result = await Auth();
  const words = await db
    .select()
    .from(wordTable)
    .where(
      and(
        eq(wordTable.user_id, result.id),
        eq(wordTable.to_language, lang),
        eq(wordTable.is_deleted, 0)
      )
    );
  if (words.length === 0) {
    redirect("/app");
  }
  const generatedWords = getRandomElements(words, Number(count));
  return <Repeat words={generatedWords} />;
}

function getRandomElements<T>(array: T[], n: number): T[] {
  if (n > array.length) {
    n = array.length;
  }

  const result: T[] = [];
  const usedIndices = new Set<number>();

  while (result.length < n) {
    const randomIndex = Math.floor(Math.random() * array.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      result.push(array[randomIndex]);
    }
  }

  return result;
}
