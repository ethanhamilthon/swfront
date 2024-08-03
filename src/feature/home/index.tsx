"use client";

import { wordTable } from "@/db/schema";
import { LanguageChange } from "./change-lang";
import { useState } from "react";
import { Card } from "./card";

export type WordType = typeof wordTable.$inferSelect;

export function HomePage({
  words,
}: {
  words: {
    language: string;
    words: WordType[];
  }[];
}) {
  const [currentLang, setLang] = useState(words[0].language);
  return (
    <main className="flex justify-center bg-white">
      <div className="container  flex flex-col gap-8">
        <div className="w-full flex flex-col gap-4">
          <div className="w-full items-center justify-between flex border-b border-b-zinc-100 sticky top-0 bg-white py-3 z-40">
            <LanguageChange
              cards={words}
              currentTarget={currentLang}
              setTarget={setLang}
            />
          </div>
          <Card
            key={currentLang}
            card={words.find((card) => card.language === currentLang)!}
          />
        </div>
      </div>
    </main>
  );
}

function wordsByLanguage(words: WordType[], languages: string[]) {
  return languages.map((lang) => {
    return {
      language: lang,
      words: words.reduce<WordType[]>((acc, word) => {
        if (word.to_language === lang) {
          acc.push(word);
        }
        return acc;
      }, []),
    };
  });
}
