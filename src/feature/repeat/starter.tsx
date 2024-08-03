"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Capitalize } from "@/utils/server/capitaliza";
import Link from "next/link";

export function RepeatStart({ languages }: { languages: string[] }) {
  const t = useTranslations("Repeat.Start");
  const [language, setLanguage] = useState(languages[0]);
  const [count, setCount] = useState(10);
  function InputValue(value: string) {
    const num = Number(value);
    if (!isNaN(num)) {
      if (num >= 0 && num <= 50) setCount(num);
    }
  }

  return (
    <main className="container justify-center pt-12 flex flex-col items-center gap-6">
      <h2 className="text-4xl font-bold text-center">
        {t.rich("Title", {
          br: () => <br />,
          sp: (chunk) => (
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
              {chunk}
            </span>
          ),
        })}
      </h2>
      <div className="flex flex-col gap-2 items-center">
        <div className="w-56 bg-zinc-100 flex divide-x divide-zinc-300 rounded-lg">
          <span
            onClick={() => {
              if (count > 10) {
                setCount((prev) => prev - 1);
              }
            }}
            className="py-4 w-1/3 select-none flex justify-center items-center cursor-pointer"
          >
            -
          </span>
          <input
            value={count}
            onChange={(e) => InputValue(e.target.value)}
            className="py-4 w-1/3 flex text-center focus:outline-purple-500 justify-center items-center cursor-pointer "
          />

          <span
            onClick={() => {
              if (count < 50) {
                setCount((prev) => prev + 1);
              }
            }}
            className="py-4 select-none w-1/3 flex justify-center items-center cursor-pointer"
          >
            +
          </span>
        </div>
        <span className="text-xs font-light text-zinc-500">{t("Max")}</span>
      </div>
      <Select value={language} onValueChange={(value) => setLanguage(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Выберите язык" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language} value={language}>
              {Capitalize(language)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Link
        href={`/app/repeat?count=${count}&language=${language}`}
        className="bg-gradient-to-br mt-12 from-indigo-400 to-indigo-600 rounded-lg disabled:from-zinc-300 disabled:to-zinc-400 disabled:cursor-not-allowed text-white py-4 px-8"
      >
        {t("Go")}
      </Link>
    </main>
  );
}
