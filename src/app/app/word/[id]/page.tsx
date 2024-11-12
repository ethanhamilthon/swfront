import { db } from "@/db";
import { wordTable } from "@/db/schema";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { RenderedWord } from "@/feature/render-word";
import { getWordDesc } from "@/feature/webscrap/worddesc";
import { ScrapLabels } from "@/feature/webscrap";

export default async function WordPage({ params }: { params: { id: string } }) {
  const [word] = await db
    .select()
    .from(wordTable)
    .where(and(eq(wordTable.id, params.id), eq(wordTable.is_deleted, 0)));
  if (!word || !word.title || !word.description) {
    redirect("/app");
  }

  const worddesc = await getWordDesc(word.title, word.to_language || "english");
  return (
    <main className="container flex relative flex-col gap-6 justify-center p-6 mt-6 w-full">
      <Link
        href={"/app/edit/" + params.id}
        className="flex absolute top-4 right-4 justify-center items-center w-8 h-8 rounded border duration-200 cursor-pointer active:scale-90 bg-zinc-100 border-zinc-200 text-zinc-400 hover:text-zinc-700"
      >
        <Pencil1Icon />
      </Link>
      <h2 className="text-2xl font-semibold text-zinc-800">{word.title}</h2>
      <ScrapLabels worddesc={worddesc} />
      <RenderedWord word={word.description} />
    </main>
  );
}
