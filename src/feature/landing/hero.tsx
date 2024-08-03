"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { scrollToElement } from "@/utils/client/scroll-to-elem";
import { sleep } from "@/utils/server/sleep";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { motion, useAnimate } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const LandingHero = () => {
  const t = useTranslations("Landing.Hero");
  const [scope, animate] = useAnimate();
  const AnimationRun = useCallback(async () => {
    await sleep(200);
    await animate("#input", { opacity: 1, y: 0 }, { duration: 0.3 });
    await animate("#gen", { opacity: 1, y: 0 }, { duration: 0.3 });
    await sleep(400);
    await animate("#gen", { scale: 0.9 }, { duration: 0.2 });
    await animate("#gen", { scale: 1 }, { duration: 0.2 });
    await animate("#desc", { opacity: 1, y: 0 }, { duration: 0.3 });
    await animate("#exam", { opacity: 1 }, { duration: 0.3 });
    await animate("#e1", { opacity: 1, y: 0 }, { duration: 0.3 });
    await animate("#e2", { opacity: 1, y: 0 }, { duration: 0.3 });
    await animate("#e3", { opacity: 1, y: 0 }, { duration: 0.3 });
    await sleep(400);
    await animate("#want", { opacity: 1, y: 0 }, { duration: 0.3 });
  }, [animate]);
  useEffect(() => {
    AnimationRun();
  }, [AnimationRun]);
  return (
    <section className="container flex relative flex-col md:flex-row items-center md:items-stretch justify-center gap-12 md:gap-24 lg:gap-48 pb-24 md:py-24 border-b border-b-zinc-300">
      <div className="absolute h-full w-full top-0 left-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <LeftSideHero />
      <div ref={scope} className="relative">
        <div className="absolute flex flex-col items-center left-1/2 -translate-x-1/2 top-12 md:top-16 w-full">
          <motion.div
            id="input"
            initial={{
              opacity: 0,
              y: 10,
            }}
            drag
            dragConstraints={{
              top: -200,
              left: -200,
              bottom: 200,
              right: 200,
            }}
            onClick={() => scrollToElement("try")}
            className="w-4/5 py-2 border border-zinc-300 pl-6 rounded-lg"
          >
            {t("Word")}
          </motion.div>
          <div className="flex justify-end w-4/5 py-2 ">
            <motion.div
              id="gen"
              initial={{
                opacity: 0,
                y: 10,
              }}
              drag
              dragConstraints={{
                top: -200,
                left: -200,
                bottom: 200,
                right: 200,
              }}
              className="px-4 py-2 rounded-md bg-violet-500 text-white "
            >
              {t("Gen")}
            </motion.div>
          </div>
          <motion.div
            id="desc"
            initial={{
              opacity: 0,
              y: 10,
            }}
            drag
            dragConstraints={{
              top: -200,
              left: -200,
              bottom: 200,
              right: 200,
            }}
            className=" bg-white rounded-xl shadow-xl border border-zinc-300 px-5 py-3 flex items-center text-center text-xs"
          >
            {t.rich("WordDesc", {
              br: () => <br />,
            })}
          </motion.div>
        </div>
        <DesktopExamples />
        <MobileExamples />
        <Image
          src="/herophone.png"
          alt="someimage"
          width={400}
          height={700}
          className="w-72 md:w-80"
        />
      </div>
    </section>
  );
};

const sleeptime = 4000;
const leftrems: {
  [key: string]: {
    first: number;
    second: number;
    third: number;
  };
} = {
  ru: {
    first: -6,
    second: -20,
    third: -10,
  },
  en: {
    first: -6,
    second: -18,
    third: -16,
  },
  fr: {
    first: 14,
    second: 0,
    third: 0,
  },
  tr: {
    first: 0,
    second: -8,
    third: -10,
  },
  zh: {
    first: -18,
    second: -22,
    third: -22,
  },
};
function LeftSideHero() {
  const t = useTranslations("Landing.Hero");
  const locale = useLocale();
  const leftpad = leftrems[locale];
  const [scope, animate] = useAnimate();
  const [isAnimationRunning, setAnimationrun] = useState(true);
  const end = useCallback(
    async (id: string) => {
      await animate(
        id,
        { scale: 0, rotate: "-6deg" },
        { duration: 0.3, type: "spring" }
      );
    },
    [animate]
  );
  const start = useCallback(
    async (id: string) => {
      await animate(
        id,
        { scale: 1, rotate: "-6deg" },
        { duration: 0.3, type: "spring" }
      );
    },
    [animate]
  );
  const LabelAnimator = useCallback(async () => {
    if (!isAnimationRunning) return;
    await sleep(sleeptime);
    await end("#purple");
    await start("#blue");
    await sleep(sleeptime);
    await end("#blue");
    await start("#green");
    await sleep(sleeptime);
    await end("#green");
    await start("#purple");
    console.log("first");
    LabelAnimator();
  }, [isAnimationRunning, end, start]);
  useEffect(() => {
    LabelAnimator();
    return () => setAnimationrun(false);
  }, [LabelAnimator]);
  return (
    <div className="flex flex-col w-3/4 md:w-auto justify-between min-h-full py-10 md:gap-0 gap-16">
      <div className="flex flex-col gap-4 items-start">
        <h1 className="text-4xl font-bold relative" ref={scope}>
          {t.rich("Title", {
            br: () => <br />,
          })}
          <span
            id="purple"
            style={{
              right: `${leftpad.first / 4}rem`,
            }}
            className="px-5 py-1 rounded-full bg-violet-500 text-white absolute text-2xl -bottom-1  -rotate-6"
          >
            {t("W1")}
          </span>
          <motion.span
            initial={{ scale: 0 }}
            id="blue"
            style={{
              right: `${leftpad.second / 4}rem`,
            }}
            className="px-5 py-1 rounded-full bg-blue-500 text-white absolute text-2xl -bottom-1  -rotate-6"
          >
            {t("W2")}
          </motion.span>
          <motion.span
            initial={{ scale: 0 }}
            id="green"
            style={{
              right: `${leftpad.third / 4}rem`,
            }}
            className="px-5 py-1 rounded-full bg-emerald-500 text-white absolute text-2xl -bottom-1  -rotate-6"
          >
            {t("W3")}
          </motion.span>
        </h1>
        <span className="font-light text-zinc-600">
          {t.rich("Desc", {
            br: () => <br />,
          })}
        </span>
      </div>
      <div className="flex flex-col items-start gap-6">
        <motion.div
          animate={{ y: [-5, 0, -5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex items-center gap-3 pl-8"
        >
          <span>{t("Noreg")}</span>
          <ChevronDownIcon width={20} height={20} />
        </motion.div>
        <button
          onClick={() => scrollToElement("try")}
          className="py-6 px-12 rounded-xl bg-violet-600 text-white font-semibold"
        >
          {t("Try")}
        </button>
      </div>
    </div>
  );
}

function DesktopExamples() {
  const t = useTranslations("Landing.Hero");
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      id="exam"
      className="absolute hidden left-1/2 -translate-x-1/2 -bottom-0 w-[600px] px-4 lg:grid grid-cols-2 gap-2 gap-y-8"
    >
      <ExampleCard dragable id="e1" ex={t("E1")} tr={t("T1")} index={1} />
      <ExampleCard dragable id="e2" ex={t("E2")} tr={t("T2")} index={2} />
      <ExampleCard dragable id="e3" ex={t("E3")} tr={t("T3")} index={3} />
      <CTAButton />
    </motion.div>
  );
}

function CTAButton() {
  const t = useTranslations("Landing.Hero");
  const [isHovered, setHover] = useState(false);
  const router = useRouter();
  return (
    <div className="w-full h-full flex justify-center items-center">
      <motion.button
        id="want"
        whileHover={{ scale: 1.2 }}
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        initial={{
          opacity: 0,
          y: 10,
        }}
        drag
        dragConstraints={{
          top: -200,
          left: -200,
          bottom: 200,
          right: 200,
        }}
        onClick={() => router.push("/app")}
        className="flex relative justify-end cursor-pointer w-3/4 h-16 border border-zinc-400 bg-white items-center rounded-full p-2"
      >
        <motion.span
          animate={{ left: isHovered ? "45%" : "35%" }}
          transition={{
            duration: 0.1,
            type: "spring",
            damping: 8,
            stiffness: 200,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          {t("So")}
        </motion.span>
        <div
          className={cn(
            "h-full aspect-square border border-zinc-400 rounded-full flex justify-center items-center duration-200 ease-in-out",
            {
              "bg-violet-500": isHovered,
            }
          )}
        >
          <ChevronRightIcon
            width={40}
            height={40}
            className={cn("duration-200 ease-in-out", {
              "text-white": isHovered,
            })}
          />
        </div>
      </motion.button>
    </div>
  );
}
function MobileExamples() {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      id="exam"
      className="absolute top-56 left-1/2 -translate-x-1/2 lg:hidden flex flex-col items-center"
    >
      <MobileExampleCarousel />
      <CTAButton />
    </motion.div>
  );
}

function ExampleCard(props: {
  dragable?: boolean;
  id: string;
  ex: string;
  tr: string;
  index: number;
}) {
  const t = useTranslations("Landing.Hero");
  return (
    <motion.div
      id={props.id}
      drag={props.dragable}
      dragConstraints={{
        top: -200,
        left: -200,
        bottom: 200,
        right: 200,
      }}
      initial={{
        opacity: 0,
        y: -10,
      }}
      dragElastic={2}
      className="bg-white rounded-xl relative shadow-xl border border-zinc-300 text-xs p-3 pt-5 flex flex-col gap-2 items-center"
    >
      <span className="px-4 py-2 bg-zinc-900 rounded-2xl text-white absolute left-1/2 -translate-x-1/2 -top-4">
        {t("Exam")} #{props.index}
      </span>
      <span>{props.ex}</span>
      <div className="w-full h-[1px] bg-zinc-300"></div>
      <span className="text-zinc-500">{props.tr}</span>
    </motion.div>
  );
}

function MobileExampleCarousel() {
  const t = useTranslations("Landing.Hero");
  return (
    <Carousel>
      <CarouselContent>
        <CarouselItem className="py-10">
          <ExampleCard id="e1" ex={t("E1")} tr={t("T1")} index={1} />
        </CarouselItem>
        <CarouselItem className="py-10">
          <ExampleCard id="e2" ex={t("E2")} tr={t("T2")} index={2} />
        </CarouselItem>
        <CarouselItem className="py-10">
          <ExampleCard id="e3" ex={t("E3")} tr={t("T3")} index={3} />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
