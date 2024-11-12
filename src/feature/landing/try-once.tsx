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
import { MainLogo } from "@/components/icons/logo";
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
        <CreateGuestWord />
      </div>
    </section>
  );
};

const CreateGuestWord = () => {
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
      {step === 3 && <Login native={nativeLang} target={targetLang} />}
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

const Login = (props: { native: string; target: string }) => {
  const t = useTranslations("Login");
  const state = JSON.stringify({
    from_language: props.native,
    to_language: props.target,
  });
  return (
    <div className="w-full flex flex-col items-center gap-12">
      <MainLogo size={1} />
      <h4 className="text-xl font-semibold text-zinc-700 text-center">
        {t("Next")}
      </h4>
      <a
        href={"/api/googleoauth/login?state=" + state}
        className="flex p-3 gap-3 sm:text-base text-sm items-center justify-center sm:px-8 rounded-md bg-zinc-50 cursor-pointer hover:bg-zinc-200 border border-zinc-200 duration-150"
      >
        <GoogleLogo />
        <span className="text-zinc-700 font-light">{t("Button")}</span>
      </a>
    </div>
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

function GoogleLogo() {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="-3 0 262 262"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
    >
      <path
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
        fill="#4285F4"
      />
      <path
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
        fill="#34A853"
      />
      <path
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
        fill="#FBBC05"
      />
      <path
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
        fill="#EB4335"
      />
    </svg>
  );
}
