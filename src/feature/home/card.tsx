import { useTranslations } from "next-intl";
import { WordType } from ".";
import Link from "next/link";
import { EyeOpenIcon, UpdateIcon } from "@radix-ui/react-icons";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GetMoreWords } from "./actions";
import { cn } from "@/lib/utils";

export function Card(props: { card: { language: string; words: WordType[] } }) {
  const t = useTranslations("Home");
  const [currentWords, setWords] = useState(props.card.words);
  const [currentCount, setCount] = useState(currentWords.length);
  const [showButton, setShowButton] = useState(true);
  async function loadWords() {
    const newWords = await GetMoreWords(currentCount, props.card.language, 20);
    setWords((prev) => [...prev, ...newWords]);
    setCount((prev) => prev + newWords.length);
    if (newWords.length < 20) {
      setShowButton(false);
    }
  }
  useEffect(() => {
    if (props.card.words.length > 10) {
      setShowButton(false);
    }
  }, [props.card.words]);
  if (props.card && props.card.words.length !== 0) {
    return (
      <motion.div className="w-full flex flex-wrap gap-3">
        <AnimatePresence>
          {currentWords.map((word, i) => {
            return (
              <Word key={i} word={word} index={i} currentCount={currentCount} />
            );
          })}
          <button
            onClick={loadWords}
            className={cn(
              "w-full py-3 flex items-center gap-3 justify-center rounded-lg bg-gradient-to-br from-violet-400 to-violet-600 text-white font-medium",
              {
                hidden: !showButton,
              }
            )}
          >
            {t("Load")}
            <UpdateIcon className="text-white font-bold" />
          </button>
        </AnimatePresence>
      </motion.div>
    );
  }
  return (
    <div className="w-full min-h-48 flex justify-center items-center">
      <span className="text-lg font-semibold text-zinc-600 text-center">
        {t.rich("Empty", {
          br: () => <br />,
        })}
      </span>
    </div>
  );
}

function Word(props: { word: WordType; index: number; currentCount: number }) {
  const t = useTranslations("Home");
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 100,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.2,
        delay: DelayCalculate(props.currentCount, props.index),
      }}
      exit={{
        opacity: 0,
        y: 100,
      }}
      className="flex-1 min-w-72 h-44  rounded-2xl border border-zinc-200 p-2 flex flex-col justify-between"
    >
      <div className="flex flex-col pt-2 pl-2">
        <span className="text-lg font-medium text-zinc-900">
          {props.word.title}
        </span>
        <p className="text-xs text-zinc-500 text line-clamp-3 whitespace-pre-line">
          {props.word.description}
        </p>
      </div>
      <Link
        href={"/app/word/" + props.word.id}
        className="px-4 py-3 flex gap-2 justify-center items-center  rounded-lg text-zinc-600 text-sm bg-white border border-zinc-200 hover:bg-zinc-100 duration-200"
      >
        <EyeOpenIcon />
        {t("Full")}
      </Link>
    </motion.div>
  );
}

//30 cc , 10 index = 0.1
function DelayCalculate(currentCounts: number, index: number) {
  const initalDelay = 0.1;
  const coefficent = 0.1;
  if (currentCounts <= 10) {
    return initalDelay + index * coefficent;
  }
  if (currentCounts - 20 > index + 1) {
    return 0;
  }
  return (index + 1 - currentCounts + 20) * coefficent;
}
