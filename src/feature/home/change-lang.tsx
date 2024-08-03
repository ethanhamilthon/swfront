"use client";

import { cn } from "@/lib/utils";
import { WordType } from ".";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRightIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { SearchResultsAction } from "./actions";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Capitalize } from "@/utils/server/capitaliza";
import { LayoutGroup, motion } from "framer-motion";

export function LanguageChange(props: {
  cards: { language: string; words: WordType[] }[];
  currentTarget: string;
  setTarget: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        <LayoutGroup>
          {props.cards.map((card) => {
            return (
              <div key={card.language} className="flex flex-col">
                <motion.button
                  layout="position"
                  onClick={() => props.setTarget(card.language)}
                  className={cn(
                    "py-2 px-4 rounded-t-lg text-zinc-400 text-sm flex flex-col gap-1 items-center",
                    {
                      " text-zinc-800 font-medium":
                        props.currentTarget === card.language,
                    }
                  )}
                >
                  <span>{Capitalize(card.language)}</span>
                </motion.button>
                {props.currentTarget === card.language && (
                  <motion.div
                    className="underline bg-violet-500 w-full h-1"
                    layoutId="underline"
                    transition={{ duration: 0.1 }}
                  />
                )}
              </div>
            );
          })}
        </LayoutGroup>
      </div>
      <SearchWord />
    </div>
  );
}

export function SearchWord() {
  const t = useTranslations("Search");
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<WordType[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  function handleChange(value: string) {
    setSearchTerm(value);
  }

  async function getSearchResult(prefix: string) {
    if (prefix) {
      const data = await SearchResultsAction(prefix);
      setResults(data);
    } else {
      setResults([]);
    }
  }

  useEffect(() => {
    getSearchResult(debouncedSearchTerm);
  }, [debouncedSearchTerm]);
  return (
    <Dialog>
      <DialogTrigger>
        <div className="p-2 border rounded-lg text-zinc-500">
          <MagnifyingGlassIcon width={16} height={16} />
        </div>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-start rounded-lg">
        <DialogHeader>
          <DialogTitle>{t("Title")}</DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col gap-6">
          <div className="w-full relative">
            <MagnifyingGlassIcon
              width={16}
              height={16}
              className="absolute top-1/2 -translate-y-1/2 left-2 text-zinc-300"
            />
            <input
              className="p-2 w-full border border-zinc-400 pl-8 rounded-xl"
              type="text"
              placeholder={t("Plc")}
              value={searchTerm}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
          <span className="text-sm font-light text-zinc-500">
            {t("Found")} : {results.length}
          </span>
          <div className="w-full h-72 overflow-y-scroll flex flex-col gap-2">
            {results.map((word) => {
              return <SearchWordCard key={word.id} word={word} />;
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SearchWordCard(props: { word: WordType }) {
  return (
    <div className="w-full p-3 flex items-center justify-between rounded-md border border-zinc-300">
      <div className="flex flex-col">
        <span className="text-xs font-light text-zinc-500">
          {props.word.to_language}
        </span>
        <span className="text-zinc-700 font-semibold">{props.word.title}</span>
      </div>
      <Link
        href={"/app/word/" + props.word.id}
        className="p-3 rounded-lg bg-violet-600"
      >
        <ChevronRightIcon className="text-white" width={16} height={16} />
      </Link>
    </div>
  );
}
