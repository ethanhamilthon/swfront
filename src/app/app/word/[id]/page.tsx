import { db } from "@/db";
import { wordTable } from "@/db/schema";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { RenderedWord } from "@/feature/render-word";

export default async function WordPage({ params }: { params: { id: string } }) {
  const [word] = await db
    .select()
    .from(wordTable)
    .where(and(eq(wordTable.id, params.id), eq(wordTable.is_deleted, 0)));
  if (!word || !word.title || !word.description) {
    redirect("/app");
  }
  return (
    <main className="w-full container flex flex-col p-6 gap-6 relative justify-center mt-6">
      <Link
        href={"/app/edit/" + params.id}
        className="w-8 h-8 bg-zinc-100 border border-zinc-200 text-zinc-400 cursor-pointer hover:text-zinc-700 duration-200 active:scale-90 flex justify-center items-center rounded absolute top-4 right-4"
      >
        <Pencil1Icon />
      </Link>
      <h2 className="text-2xl font-semibold text-zinc-800">{word.title}</h2>
      <RenderedWord word={word.description} />
    </main>
  );
}
