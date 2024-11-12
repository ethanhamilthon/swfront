"use client";

import { MainLogo } from "@/components/icons/logo";
import { LocalChange } from "../local";
import { scrollToElement } from "@/utils/client/scroll-to-elem";
import { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";

export const LandingHeader = () => {
  const t = useTranslations("Landing.Header");
  return (
    <header className="w-full sticky top-0 py-3 px-2 sm:px-8 z-50">
      <div className="w-full p-3 px-8 rounded-full border flex items-center justify-between border-violet-200 backdrop-blur bg-white/50">
        <MainLogo size={1} />
        <nav className="hidden items-center gap-8 text-sm font-light text-violet-950 md:flex">
          <ScrollButton id="stats">{t("Over")}</ScrollButton>
          <ScrollButton id="works">{t("Works")}</ScrollButton>
          <ScrollButton id="try">{t("Try")}</ScrollButton>
          <ScrollButton id="price">{t("Price")}</ScrollButton>
        </nav>
        <Menu />
        <div className="lg:flex hidden">
          <LocalChange />
        </div>
      </div>
    </header>
  );
};

const Menu = () => {
  const t = useTranslations("Landing.Header");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="px-5 py-2 bg-violet-500 text-white rounded-lg cursor-pointer lg:hidden flex">
          Menu
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <ScrollButton id="stats">{t("Over")}</ScrollButton>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ScrollButton id="works">{t("Works")}</ScrollButton>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ScrollButton id="try">{t("Try")}</ScrollButton>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ScrollButton id="price">{t("Price")}</ScrollButton>
        </DropdownMenuItem>
        <LocalChange />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ScrollButton = (props: {
  id: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <button
      className={props.className}
      onClick={() => scrollToElement(props.id)}
    >
      {props.children}
    </button>
  );
};
