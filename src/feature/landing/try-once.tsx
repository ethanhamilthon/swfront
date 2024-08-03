"use client";

import { useFingerprintLS } from "@/utils/client/fingerprint";
import { useState } from "react";
import { RenderedWordByStep } from "../render-word";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { OsLanguages, TargetLanguages } from "@/utils/server/system-langs";
import Image from "next/image";
import { motion } from "framer-motion";
import { addLetters } from "@/utils/server/guesthash";
import { useTranslations } from "next-intl";
export const LandingTryOnce = () => {
  const { fpLSValue, fpstr, setFPLS, finished } = useFingerprintLS();
  const t = useTranslations("Landing.TryOnce");

  return (
    <section
      id="try"
      className="container flex flex-col items-center gap-12 mt-20"
    >
      <h3 className="text-3xl font-bold text-center">
        {t.rich("Title", {
          br: () => <br />,
        })}
      </h3>
      <div className="flex flex-col max-w-3xl px-4 sm:px-12 mb-20 bg-zinc-50 rounded-lg w-full py-12">
        {finished ? (
          fpLSValue !== null ? (
            <RenderWord title={fpLSValue.title} desc={fpLSValue.desc} />
          ) : (
            <CreateGuestWord fp={fpstr} setValues={setFPLS} />
          )
        ) : (
          <div>{t("Loading")}</div>
        )}
      </div>
    </section>
  );
};

const CreateGuestWord = (props: {
  fp: string;
  setValues: (values: { title: string; desc: string }) => void;
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [nativeLang, setNativeLang] = useState("");
  const [targetLang, setTargetLang] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [isRequested, setrequested] = useState(false);

  function setNative(value: string) {
    setStep(2);
    setNativeLang(value);
  }
  function setTarget(value: string) {
    setStep(3);
    setTargetLang(value);
  }
  function GoBackFromTarget() {
    setStep(1);
    setNativeLang("");
  }
  function GoBackFromForm() {
    setStep(2);
    setTargetLang("");
  }
  function setTitleForm(value: string) {
    setTitle(value);
    Generate(value);
  }

  async function Generate(value: string) {
    setrequested(true);
    const response = await fetch("/api/guest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        word: value,
        token: addLetters(props.fp),
        from: nativeLang,
        to: targetLang,
      }),
    });
    let result = "";
    if (response.status === 203) {
      const body = await response.json();
      props.setValues({ title: body.title, desc: body.desc });
      return;
    }
    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value);
        setDesc((prev) => prev + chunk);
        result = result + chunk;
      }
    }
    console.log(value, result);
    props.setValues({ title: value, desc: result });
  }
  return (
    <div className="flex flex-col items-start gap-12">
      <Progress step={step} />
      {step === 1 && <SelectNative setNative={setNative} />}
      {step === 2 && (
        <SelectTarget
          setTarget={setTarget}
          GoBackFromTarget={GoBackFromTarget}
        />
      )}
      {step === 3 &&
        (isRequested ? (
          <RenderWord title={title} desc={desc} />
        ) : (
          <AskForm setTitle={setTitleForm} GoBackFromForm={GoBackFromForm} />
        ))}
    </div>
  );
};

const SelectNative = (props: { setNative: (value: string) => void }) => {
  const t = useTranslations("Landing.TryOnce");
  return (
    <>
      <h4 className="text-xl font-semibold text-zinc-700">
        {t.rich("NativeLang", {
          br: () => <br />,
        })}
      </h4>
      <div className="flex flex-wrap gap-6 w-full">
        {OsLanguages.map((lang) => {
          return (
            <div
              key={lang.short}
              onClick={() => props.setNative(lang.value)}
              className="flex-1 flex items-center gap-4 bg-white p-3 rounded-xl min-w-56 hover:bg-zinc-200 duration-200 cursor-pointer"
            >
              <Image
                src={"/" + lang.icon}
                alt={lang.text}
                width={100}
                height={100}
                className="w-12 h-12"
              />
              <span className="text-nowrap">{lang.text}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

const SelectTarget = (props: {
  setTarget: (value: string) => void;
  GoBackFromTarget: () => void;
}) => {
  const t = useTranslations("Landing.TryOnce");
  return (
    <>
      <h4 className="text-xl font-semibold text-zinc-700">
        {t.rich("ToLang", {
          br: () => <br />,
        })}
      </h4>
      <div className="flex flex-wrap gap-6 w-full">
        {TargetLanguages.map((lang) => {
          return (
            <div
              key={lang.value}
              onClick={() => props.setTarget(lang.value)}
              className="flex-1 flex items-center gap-4 bg-white p-3 rounded-xl min-w-56 hover:bg-zinc-200 duration-200 cursor-pointer"
            >
              <Image
                src={"/" + lang.icon}
                alt={lang.text}
                width={100}
                height={100}
                className="w-12 h-12"
              />
              <span className="text-nowrap">{lang.text}</span>
            </div>
          );
        })}
      </div>
      <div className="w-full flex">
        <button
          onClick={props.GoBackFromTarget}
          className="px-6 py-3 border border-zinc-300 rounded-lg"
        >
          {t("Back")}
        </button>
      </div>
    </>
  );
};

const AskForm = (props: {
  setTitle: (value: string) => void;
  GoBackFromForm: () => void;
}) => {
  const [title, setTitle] = useState("");
  const t = useTranslations("Landing.TryOnce");
  return (
    <>
      <h4 className="text-xl font-semibold text-zinc-700">
        {t.rich("YourWord", {
          br: () => <br />,
        })}
      </h4>
      <input
        placeholder="ex: apple, car, running..."
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-3 w-full text-lg rounded-xl px-5 border border-zinc-300"
      />
      <div className="w-full justify-between items-center flex">
        <button
          onClick={props.GoBackFromForm}
          className="px-6 py-3 border border-zinc-300 rounded-lg"
        >
          {t("Back")}
        </button>
        <button
          onClick={() => props.setTitle(title)}
          className="px-6 py-3 rounded-lg bg-violet-500 text-white font-semibold"
        >
          {t("Go")}
        </button>
      </div>
    </>
  );
};

const Progress = (props: { step: number }) => {
  let procent = 100;
  switch (props.step) {
    case 1:
      procent = 10;
      break;
    case 2:
      procent = 40;
      break;
    case 3:
      procent = 80;
      break;
    default:
      procent = 100;
      break;
  }
  return (
    <div className="w-full">
      <motion.div
        animate={{
          width: `${procent}%`,
        }}
        className="h-2 rounded-full bg-violet-600"
      ></motion.div>
    </div>
  );
};

const RenderWord = ({ title, desc }: { title: string; desc: string }) => {
  const [step, setStep] = useState(1);
  const t = useTranslations("Landing.TryOnce");
  return (
    <div className="w-full flex flex-col items-start gap-6">
      <h4 className="text-2xl font-bold">{title}</h4>
      <RenderedWordByStep word={desc} index={step} />
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (step > 1) {
                setStep((prev) => prev - 1);
              }
            }}
            disabled={step <= 1}
            className="p-4 bg-zinc-100 rounded-lg border border-zinc-200 disabled:text-zinc-400 disabled:bg-zinc-50 disabled:border-none"
          >
            <ChevronLeftIcon width={20} height={20} />
          </button>
          <button
            onClick={() => {
              if (step < 3) {
                setStep((prev) => prev + 1);
              }
            }}
            disabled={step >= 3}
            className="p-4 bg-zinc-100 rounded-lg border border-zinc-200 disabled:text-zinc-400 disabled:bg-zinc-50 disabled:border-none"
          >
            <ChevronRightIcon width={20} height={20} />
          </button>
        </div>
        <Link
          href={"/app"}
          className="px-6 py-3 bg-violet-600 rounded-lg text-white font-medium"
        >
          {t("More")}
        </Link>
      </div>
    </div>
  );
};
