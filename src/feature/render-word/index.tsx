"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function RenderedWord({ word }: { word: string }) {
  const splitted = SplitWord(word);
  return (
    <>
      <p className="text-zinc-600 whitespace-pre-line">{splitted[0]}</p>
      {splitted.map((s, i) => {
        if (i === 0 || i === 4 || !s) {
          return null;
        }
        return (
          <div
            key={s}
            className="text-zinc-600 whitespace-pre-line p-4 rounded-xl border border-zinc-200 flex flex-col divide-y"
          >
            {s.split("\n").map((s, i) => {
              return s.length > 5 ? (
                <p
                  key={i}
                  className={cn("py-3", {
                    "text-zinc-400": i !== 0,
                  })}
                >
                  {s}
                </p>
              ) : null;
            })}
          </div>
        );
      })}
      <p className="text-zinc-600 whitespace-pre-line">{splitted[4]}</p>
    </>
  );
}

export function RenderedWordByStep({
  word,
  index,
}: {
  word: string;
  index: number;
}) {
  const splitted = SplitWord(word);
  return (
    <>
      <p className="text-zinc-600 whitespace-pre-line">{splitted[0]}</p>
      {splitted.map((s, i) => {
        if (i === 0 || i === 4 || !s || i !== index) {
          return null;
        }
        return (
          <motion.div
            initial={{
              opacity: 0,
              x: 10,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            key={s}
            className="text-zinc-600 whitespace-pre-line p-4 bg-white rounded-xl border border-zinc-200 flex flex-col divide-y"
          >
            {s.split("\n").map((s, i) => {
              return s.length > 5 ? (
                <p
                  key={i}
                  className={cn("py-3", {
                    "text-zinc-400": i !== 0,
                  })}
                >
                  {s}
                </p>
              ) : null;
            })}
          </motion.div>
        );
      })}
      <p className="text-zinc-600 whitespace-pre-line">{splitted[4]}</p>
    </>
  );
}

export function SplitWord(input: string) {
  let pre = "";
  let part1 = "";
  let part2 = "";
  let part3 = "";
  let post = "";
  let prev = "";
  let currentType: "pre" | "1" | "2" | "3" | "post" = "pre";
  for (let char of input) {
    switch (char) {
      case "1":
        if (prev === "\n") {
          currentType = "1";
        }
        break;
      case "2":
        if (prev === "\n") {
          currentType = "2";
        }
        break;
      case "3":
        if (prev === "\n") {
          currentType = "3";
        }

        break;
      case "\n":
        if (prev === "\n" && currentType === "3") {
          currentType = "post";
        }
        break;
    }
    switch (currentType) {
      case "pre":
        pre = pre + char;
        break;
      case "1":
        part1 = part1 + char;
        break;
      case "2":
        part2 = part2 + char;
        break;
      case "3":
        part3 = part3 + char;
        break;
      case "post":
        post = post + char;
        break;
    }
    prev = char;
  }
  return [
    pre.replace(/^\n+|\n+$/g, ""),
    part1.replace(/^\n+|\n+$/g, ""),
    part2.replace(/^\n+|\n+$/g, ""),
    part3.replace(/^\n+|\n+$/g, ""),
    post.replace(/^\n+|\n+$/g, ""),
  ] as const;
}
