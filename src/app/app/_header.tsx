"use client";

import { MainLogo, SmallLogo } from "@/components/icons/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  FileTextIcon,
  LightningBoltIcon,
  PersonIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";

export function Header({ userLanguages }: { userLanguages: string[] }) {
  const t = useTranslations("Header");
  const pathname = usePathname();
  const [windowWidth, setWidth] = useState(400);
  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment.length > 0);
  const firstSegment = (pathSegments.length > 0 ? pathSegments[1] : "") || "";

  useLayoutEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  }, []);
  return (
    <header className="w-full flex justify-center py-3 sm:py-6 bg-white border-b border-b-zinc-300">
      <div className="w-full shadow-2xl shadow-black/100 bg-white flex justify-around fixed left-0 bottom-0 md:hidden z-50">
        <Link
          href={"/app"}
          className={cn(
            "py-6 justify-center flex gap-1 items-center text-zinc-400",
            {
              " text-zinc-700 font-semibold": firstSegment === "",
            }
          )}
        >
          <FileTextIcon
            width={18}
            height={18}
            className={cn("text-zinc-400", {
              "text-zinc-700": firstSegment === "",
            })}
          />
          {t("Word")}
        </Link>
        <Link
          href={"/app/play"}
          className={cn(
            "py-6 justify-center flex gap-1 items-center text-zinc-400",
            {
              " text-zinc-700 font-semibold":
                firstSegment === "play" || firstSegment === "goplay",
            }
          )}
        >
          <LightningBoltIcon
            width={18}
            height={18}
            className={cn("text-zinc-400", {
              "text-zinc-700":
                firstSegment === "play" || firstSegment === "goplay",
            })}
          />
          {t("Play")}
        </Link>
        <Link
          href={"/app/profile"}
          className={cn(
            "py-6 justify-center flex gap-1 items-center text-zinc-400",
            {
              " text-zinc-700 font-semibold": firstSegment === "profile",
            }
          )}
        >
          <PersonIcon
            width={18}
            height={18}
            className={cn("text-zinc-400", {
              "text-zinc-700": firstSegment === "profile",
            })}
          />
          {t("Profile")}
        </Link>
      </div>

      <div className="container flex justify-between items-center">
        <Link
          href="/app"
          className="text-3xl font-bold text-zinc-900 cursor-pointer"
        >
          {windowWidth > 500 ? (
            <MainLogo size={1.2} />
          ) : (
            <SmallLogo size={1.2} />
          )}
        </Link>
        <nav className="items-center gap-12 hidden md:flex">
          <Link
            href={"/app"}
            className=" flex justify-center items-center gap-2 text-zinc-500 hover:text-zinc-700 duration-150"
          >
            <FileTextIcon width={18} height={18} className="text-zinc-400" />
            {t("Word")}
          </Link>
          <Link
            href={"/app/play"}
            className="flex justify-center items-center gap-2 text-zinc-500 hover:text-zinc-700 duration-150"
          >
            <LightningBoltIcon
              width={18}
              height={18}
              className="text-zinc-400"
            />
            {t("Play")}
          </Link>
          <Link
            href={"/app/profile"}
            className=" flex justify-center items-center gap-2 text-zinc-500 hover:text-zinc-700 duration-150"
          >
            <PersonIcon width={18} height={18} className="text-zinc-400" />
            {t("Profile")}
          </Link>
        </nav>
        {firstSegment !== "ask" && <ToAsk userLanguages={userLanguages} />}
      </div>
    </header>
  );
}

function ToAsk({ userLanguages }: { userLanguages: string[] }) {
  const t = useTranslations("Header");
  const router = useRouter();
  if (userLanguages.length === 1) {
    return (
      <Link
        href={"/app/ask/" + userLanguages[0]}
        className="flex justify-center font-medium text-sm gap-1 px-5 py-3 sm:py-3 sm:px-6 bg-purple-700 items-center text-white rounded-lg"
      >
        <PlusCircledIcon width={16} height={16} />
        <span>{t("New")}</span>
      </Link>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex justify-center font-medium text-sm gap-1 px-5 py-3 sm:py-3 sm:px-6 bg-purple-700 items-center text-white rounded-lg">
          <PlusCircledIcon width={16} height={16} />
          <span>{t("New")}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 mr-6 shadow-2xl">
        <DropdownMenuLabel>{t("Choose")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userLanguages.map((language) => {
          return (
            <DropdownMenuItem
              onClick={() => {
                router.push("/app/ask/" + language);
              }}
              key={language}
              className="py-2 flex items-center justify-between cursor-pointer"
            >
              <span>{language}</span>
              <PlusCircledIcon width={16} height={16} />
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
