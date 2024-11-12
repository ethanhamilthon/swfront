"use client";

import { ChevronDownIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { useState } from "react";

export const LandingFAQ = () => {
  const t = useTranslations("Landing.FAQ");
  return (
    <section className="w-full flex flex-col items-center gap-12 bg-gradient-to-br from-violet-500 to-violet-700 py-12">
      <h3 className="text-white text-2xl font-bold">{t("Title")}</h3>
      <div className="max-w-3xl flex flex-col gap-4 px-6 w-full">
        <Question question={t("Q1")} answer={t("A1")} />
        <Question question={t("Q2")} answer={t("A2")} />
        <Question question={t("Q3")} answer={t("A3")} />
        <Question question={t("Q4")} answer={t("A4")} />
      </div>
    </section>
  );
};

function Question(props: { question: string; answer: string }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="w-full flex flex-col p-4 gap-3 bg-white rounded-lg">
      <div className="flex w-full items-center justify-between">
        <h5 className="text-lg font-semibold">{props.question}</h5>
        <ChevronDownIcon
          width={20}
          height={20}
          onClick={() => setOpen((prev) => !prev)}
        />
      </div>

      {isOpen && (
        <motion.p
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-zinc-600 font-light"
        >
          {props.answer}
        </motion.p>
      )}
    </div>
  );
}
