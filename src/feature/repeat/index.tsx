"use client";

import { wordTable } from "@/db/schema";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RenderedWord } from "../render-word";
import { ScrapLabels } from "../webscrap";
import { getWordDesc, WordDescType } from "../webscrap/worddesc";
import { WordDescAction } from "../webscrap/worddesc-action";

export type WordType = typeof wordTable.$inferSelect;

export function Repeat({ words }: { words: WordType[] }) {
  const count = words.length;
  const [currentStep, setStep] = useState(0);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);
  const t = useTranslations("Repeat");
  return (
    <main className="container h-dvh">
      <div className="sticky w-full py-6 flex justify-between items-center top-0 bg-white">
        <button
          disabled={currentStep <= 0}
          onClick={() => setStep((prev) => prev - 1)}
          className="py-3 px-5 text-sm disabled:text-zinc-300 disabled:cursor-not-allowed bg-zinc-100 border border-zinc-300 rounded-xl text-zinc-600"
        >
          {t("Back")}
        </button>
        <span className="font-semibold flex items-center gap-2">
          <span className="text-2xl text-zinc-700">{currentStep + 1}</span>
          <span className="text-zinc-400">/ {count}</span>
        </span>
        {currentStep + 1 < count ? (
          <button
            disabled={currentStep + 1 >= count}
            onClick={() => setStep((prev) => prev + 1)}
            className="py-3 px-5 text-sm bg-purple-600 disabled:bg-purple-400 disabled:cursor-not-allowed rounded-xl text-white"
          >
            {t("Next")}
          </button>
        ) : (
          <Link
            href={"/app"}
            className="py-3 px-5 text-sm bg-green-600 rounded-xl text-white"
          >
            {t("End")}
          </Link>
        )}
      </div>
      <div className="flex flex-col gap-6 pb-24">
        <h2 className="text-2xl font-semibold text-zinc-800">
          {words[currentStep].title}
        </h2>
        <Labels
          word={words[currentStep].title}
          lang={words[currentStep].to_language || "english"}
        />
        <RenderedWord word={words[currentStep].description || ""} />
      </div>
    </main>
  );
}

function Labels(props: { word: string; lang: string }) {
  const [loading, setLoading] = useState(false);
  const [wordDescData, setWordDescData] = useState<WordDescType | null>(null);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await WordDescAction(props.word, props.lang);
      setWordDescData(data);
      setLoading(false);
    })();
  }, [props.word, props.lang]);

  if (loading) {
    return <div className="flex items-center">Loading...</div>;
  }
  if (!wordDescData) {
    return null;
  }
  return <ScrapLabels worddesc={wordDescData} />;
}
