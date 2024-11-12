"use server";

import { getWordDesc } from "./worddesc";

export async function WordDescAction(word: string, lang: string) {
  const obj = await getWordDesc(word, lang);
  return obj;
}
