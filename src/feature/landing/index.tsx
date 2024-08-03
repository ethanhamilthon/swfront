import { MainLogo } from "@/components/icons/logo";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import {
  BellIcon,
  DrawingPinIcon,
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  InstagramLogoIcon,
  LetterCaseCapitalizeIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import { LocalChange } from "../local";
import { Pricing } from "../pricing";
import { PricingTitles } from "../pricing/titles";
import { LandingHero } from "./hero";
import { LandingHeader } from "./header";
import { LandingStats } from "./stats";
import { HowStart } from "./howworks";
import { LandingTryOnce } from "./try-once";
import { LandingFAQ } from "./faq";

export function LandingPage() {
  return (
    <>
      <LandingHeader />
      <div className="absolute top-0 z-[-2] h-screen w-screen  bg-[radial-gradient(100%_50%_at_50%_0%,rgba(100,34,255,0.3)_0,rgba(184,43,255,0)_50%,rgba(138,43,226,0)_100%)]"></div>

      <LandingHero />
      <LandingStats />

      <HowStart />
      <LandingTryOnce />
      <PricingSection />
      <LandingFAQ />
      <CallToAction />
      <Footer />
    </>
  );
}

async function Header() {
  return (
    <header className="w-full">
      <div className="container flex justify-between items-center py-6">
        <MainLogo size={1} />
        <LocalChange />
      </div>
    </header>
  );
}

function Hero() {
  const t = useTranslations("Landing");
  return (
    <main className="container flex items-center flex-col gap-6 justify-center bgradient py-12 sm:py-24">
      <h1 className="text-3xl sm:text-4xl font-bold text-zinc-700 text-center">
        {t.rich("Title", {
          br: () => <br />,
          sp: (chunk) => (
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
              {chunk}
            </span>
          ),
        })}
      </h1>
      <h3 className="font-light sm:text-base text-sm text-zinc-600 text-center">
        {t.rich("Desc", {
          br: () => <br />,
          sp: (chunk) => (
            <span className="bg-gradient-to-r font-medium from-purple-400 to-purple-600 text-transparent bg-clip-text">
              {chunk}
            </span>
          ),
        })}
      </h3>
      <div className="flex gap-4">
        <Link
          href="/app"
          className="py-2 px-4 bg-zinc-100 text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-200 duration-150"
        >
          {t("LoginButton")}
        </Link>
        <Link
          href="/app"
          className="py-2 px-4 bg-violet-600 text-white border border-purple-200 rounded-lg hover:bg-violet-700 duration-150"
        >
          {t("TryButton")}
        </Link>
      </div>
      <Image
        priority
        width={800}
        height={600}
        alt="hero"
        src="/hero.jpg"
        className="w-full sm:w-4/5 rounded-xl h-96 object-cover border-4 border-violet-600/20"
      />
    </main>
  );
}

function Paradox() {
  const t = useTranslations("Landing.Paradox");
  const locale = useLocale();
  return (
    <section className="flex lg:flex-row flex-col container gap-8 min-h-72 py-12 md:px-32 px-4 sm:px-12">
      <div className="max-w-md flex flex-col justify-between h-full">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-zinc-700">{t("Title")}</h2>
          <p className="text-sm font-light text-zinc-500">{t("Desc1")}</p>
        </div>
        <p className="text-sm font-light text-zinc-700 mt-16">{t("Desc2")}</p>
      </div>
      <Image
        src={`/${locale}_paradox.png`}
        alt="Paradox"
        width={600}
        height={400}
        className="w-full h-72 object-scale-down"
      />
    </section>
  );
}

function WhyUs() {
  const t = useTranslations("Landing.WhyUs");
  return (
    <section className="flex justify-center w-full bg-gradient-to-br from-violet-500 to-violet-700 py-12">
      <div className="container flex flex-col items-center gap-6">
        <h2 className="text-2xl font-bold text-white">{t("Title")}</h2>
        <div className="w-full flex flex-col md:flex-row md:items-start justify-center gap-4">
          <div className="flex flex-col items-center justify-center gap-4">
            <WhyUsCard
              title={t("Card1.Title")}
              desc={t("Card1.Desc")}
              icon={RocketIcon}
            />
            <WhyUsCard
              title={t("Card3.Title")}
              desc={t("Card3.Desc")}
              icon={LetterCaseCapitalizeIcon}
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <WhyUsCard
              title={t("Card2.Title")}
              desc={t("Card2.Desc")}
              icon={BellIcon}
            />
            <WhyUsCard
              title={t("Card4.Title")}
              desc={t("Card4.Desc")}
              icon={DrawingPinIcon}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyUsCard(props: {
  title: string;
  desc: string;
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
}) {
  return (
    <div className="bg-gradient-to-br from-white to-violet-100 flex flex-col gap-3 rounded-md max-w-80 w-full p-4">
      <div className="flex items-center justify-between w-full text-lg font-bold text-violet-900">
        <span className="text-lg font-bold text-violet-900 leading-6">
          {props.title}
        </span>
        <props.icon width={20} height={20} />
      </div>
      <p className="text-sm font-light text-zinc-600">{props.desc}</p>
    </div>
  );
}

function CallToAction() {
  const t = useTranslations("Landing.CTA");
  return (
    <section className="container flex flex-col items-center gap-16 py-12">
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-balance text-center text-xl font-bold text-zinc-700">
          {t("Title")}
        </h3>
        <span className="text-balance text-center font-light text-sm text-zinc-600">
          {t("Desc")}
        </span>
      </div>
      <Link
        href="/app"
        className="px-6 py-3 bg-violet-500 font-bold text-white rounded-lg"
      >
        {t("Button")}
      </Link>
    </section>
  );
}

function Footer() {
  const t = useTranslations("Landing.Footer");
  return (
    <footer className="w-full bg-gray-800 flex flex-col items-center py-6 gap-6">
      <Link href="/" className="underline text-white">
        vocabraze.com | 2024
      </Link>
      <span className="text-lg text-white font-semibold">{t("Links")}</span>
      <div className="flex items-center gap-4">
        <Link href="https://github.com/ethaningenium" target="_blank">
          <GitHubLogoIcon width={20} height={20} className="text-white" />
        </Link>
        <Link href="https://instagram.com/ethanmotion" target="_blank">
          <InstagramLogoIcon width={20} height={20} className="text-white" />
        </Link>

        <Link href="https://t.me/heilethan" target="_blank">
          <EnvelopeClosedIcon width={20} height={20} className="text-white" />
        </Link>
      </div>
    </footer>
  );
}

function PricingSection() {
  return (
    <section
      id="price"
      className="container flex flex-col items-center gap-6 mb-16"
    >
      <PricingTitles />
      <Pricing />
    </section>
  );
}
