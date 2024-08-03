"use client";

import { useState } from "react";
import { OsLanguages, TargetLanguages } from "@/utils/server/system-langs";
import { SetLocale, UpdateLanguages } from "./actions";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function Onboarding() {
  const [step, setStep] = useState<"os" | "target">("os");
  const [osLang, setOsLang] = useState("");
  function OsStepHandle(value: string) {
    setOsLang(value);
    setStep("target");
  }
  async function TargetStepHandle(value: string[]) {
    if (osLang === "" || value.length === 0) {
      return;
    }
    try {
      await UpdateLanguages(osLang, value);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <main className="flex justify-center container flex-col gap-8 py-12">
      {step === "os" && <OsLanguage Next={OsStepHandle} />}
      {step === "target" && <TargetLanguage Complete={TargetStepHandle} />}
    </main>
  );
}

export function OsLanguage(props: { Next: (value: string) => void }) {
  const [selected, setSelected] = useState("");
  const t = useTranslations("Onboard.OS");
  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <h2 className="text-xl sm:text-3xl text-zinc-700 font-bold">
          1/2. {t("Title")}
        </h2>
        <p className="leading-5 text-sm font-light text-purple-700 bg-purple-100 rounded-lg p-4">
          {t("Desc")}
        </p>
      </div>
      <div className="w-full flex flex-col gap-4">
        {OsLanguages.map((lang) => {
          return (
            <div
              key={lang.value}
              className={cn(
                "flex items-center gap-8 p-3 sm:p-4 rounded-xl border  border-zinc-300 bg-zinc-100 cursor-pointer",
                {
                  "border border-purple-400 bg-purple-500 ":
                    selected === lang.value,
                }
              )}
              onClick={async () => {
                setSelected(lang.value);
                SetLocale(lang.short.toLowerCase());
              }}
            >
              <Image
                src={"/" + lang.icon}
                alt={lang.value}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <span
                className={cn(
                  "text-base sm:text-xl font-medium text-zinc-500",
                  {
                    "text-white": selected === lang.value,
                  }
                )}
              >
                {lang.text}
              </span>
            </div>
          );
        })}
      </div>
      <div className="w-full flex justify-end">
        <button
          disabled={selected === ""}
          onClick={() => props.Next(selected)}
          className={cn("py-4 bg-purple-700 rounded-xl px-8 text-white", {
            "bg-zinc-400 cursor-not-allowed": selected === "",
          })}
        >
          {t("Button")}
        </button>
      </div>
    </>
  );
}

export function TargetLanguage(props: {
  Complete: (selected: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const t = useTranslations("Onboard.Target");
  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <h2 className="text-xl sm:text-3xl text-zinc-700 font-bold">
          2/2. {t("Title")}
        </h2>
        <p className="leading-5 text-sm font-light text-purple-700 bg-purple-100 rounded-lg p-4">
          {t("ChooseOnly")}
          {selected.length === 0
            ? t("EmptySelect")
            : t("Selected") + selected.join(", ")}
        </p>
      </div>
      <div className="w-full flex flex-col gap-4">
        {TargetLanguages.map((lang) => {
          return (
            <div
              key={lang.value}
              className={cn(
                "flex items-center gap-8 p-3 sm:p-4 rounded-xl border  border-zinc-300 bg-zinc-100 cursor-pointer",
                {
                  "border border-purple-400 bg-purple-500 ": selected.includes(
                    lang.value
                  ),
                }
              )}
              onClick={() => {
                if (selected.includes(lang.value)) {
                  setSelected((prev) =>
                    prev.filter((value) => value !== lang.value)
                  );
                } else {
                  setSelected((prev) => [...prev, lang.value]);
                }
              }}
            >
              <Image
                src={"/" + lang.icon}
                alt={lang.value}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <span
                className={cn(
                  "text-base sm:text-xl font-medium text-zinc-500",
                  {
                    "text-white": selected.includes(lang.value),
                  }
                )}
              >
                {lang.text}
              </span>
            </div>
          );
        })}
      </div>
      <div className="w-full flex justify-end">
        <button
          disabled={selected.length === 0}
          onClick={() => props.Complete(selected)}
          className={cn("py-4 bg-purple-700 rounded-xl px-8 text-white", {
            "bg-zinc-400 cursor-not-allowed": selected.length === 0,
          })}
        >
          {t("Button")}
        </button>
      </div>
    </>
  );
}
