"use client";

import { Capitalize } from "@/utils/server/capitaliza";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { v4 } from "uuid";
import { RenderedWord } from "../render-word";
import { useRouter } from "next/navigation";
import { WordDescAction } from "../webscrap/worddesc-action";
import { WordDescType } from "../webscrap/worddesc";
import { ScrapLabels } from "../webscrap";

export function Ask(props: {
  token: string;
  from: string;
  to: string;
  pointcount: number;
}) {
  const t = useTranslations("Ask");
  const [message, setMessage] = useState<string>("");
  const [word, setWord] = useState("");
  const [requested, setRequested] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [wordID] = useState(v4());
  const [wordDescData, setWordDescData] = useState<WordDescType | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    const worddesc = await WordDescAction(word, props.to);
    setWordDescData(worddesc);
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: wordID,
        word: word,
        token: props.token,
        from: props.from,
        to: props.to,
      }),
    });
    setRequested(true);

    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value);
        setMessage((prev) => prev + chunk);
      }
    }
    setLoading(false);
    router.refresh();
    router.prefetch("/app");
  };
  return (
    <main className="container flex flex-col gap-6  justify-center mt-12">
      {!requested && (
        <>
          <div className="w-full flex flex-col gap-4 ">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-zinc-500">
                {t("YourLang") + " "}{" "}
                <span className="bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
                  {Capitalize(props.to)}
                </span>
              </span>
              <span className="text-zinc-400">
                {t.rich("Left", {
                  p: () => (
                    <span className="text-violet-600">{props.pointcount}</span>
                  ),
                })}
              </span>
            </div>
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder={t("InputP")}
              className="border border-zinc-300 rounded-2xl pl-6 py-3 focus:outline focus:outline-purple-500"
            />
          </div>
          <Guide lang={Capitalize(props.to)} />
        </>
      )}
      {requested && (
        <div className="w-full flex flex-col gap-6">
          {wordDescData && <ScrapLabels worddesc={wordDescData} />}
          <RenderedWord word={message} />
        </div>
      )}
      <div className="w-full flex justify-end items-center mt-8">
        {requested && !isLoading ? (
          <Link
            href={"/app/word/" + wordID}
            className=" py-4 bg-emerald-500 rounded-xl px-8 text-white"
          >
            {t("Button2")}
          </Link>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={word === "" || isLoading}
            className=" py-4 bg-purple-700 rounded-xl px-8 text-white disabled:bg-zinc-400 disabled:cursor-not-allowed"
          >
            {t("Button1")}
          </button>
        )}
      </div>
    </main>
  );
}

function Guide(props: { lang: string }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Ask.Guide");
  return (
    <div className="w-full flex flex-col gap-4 p-2 px-4 bg-purple-100 border border-purple-300 rounded-lg">
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="flex justify-between text-sm items-center cursor-pointer text-purple-800"
      >
        <span>{t("Main")}</span>
        {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </div>
      {open && (
        <div className="flex flex-col gap-1 text-xs font-light text-purple-600">
          <span>{t("1") + props.lang} </span>
          <span>{t("2")}</span>
          <span>{t("3")}</span>
        </div>
      )}
    </div>
  );
}
