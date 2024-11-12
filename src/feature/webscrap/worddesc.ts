import { db } from "@/db";
import { wordDescTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 } from "uuid";
import { z } from "zod";

const WordDescSchema = z.object({
  pos: z.string(),
  level: z.string(),
  article: z.string(),
  pronounce: z.string(),
});

export type WordDescType = z.infer<typeof WordDescSchema>;

export async function getWordDesc(word: string, lang: string) {
  const obj: WordDescType = {
    pos: "",
    level: "",
    article: "",
    pronounce: "",
  };
  const wordDesc = await db
    .select()
    .from(wordDescTable)
    .where(eq(wordDescTable.wordTitle, word.toLocaleLowerCase()));
  if (wordDesc.length === 0) {
    const res = await (
      await fetch(process.env.SCRAP_URL + `?lang=${lang}&word=${word}`)
    ).json();
    const worddescobj = WordDescSchema.safeParse(res);
    if (worddescobj.success) {
      obj.pos = worddescobj.data.pos;
      obj.level = worddescobj.data.level;
      obj.article = worddescobj.data.article;
      obj.pronounce = worddescobj.data.pronounce;

      await db
        .insert(wordDescTable)
        .values({
          id: v4(),
          wordTitle: word.toLocaleLowerCase(),
          toLanguage: lang,
          pos: obj.pos,
          level: obj.level,
          article: obj.article,
          pronounce: obj.pronounce,
        })
        .execute();
    }
    return obj;
  }

  obj.article = wordDesc[0].article || "";
  obj.level = wordDesc[0].level || "";
  obj.pos = wordDesc[0].pos || "";
  obj.pronounce = wordDesc[0].pronounce || "";
  return obj;
}
