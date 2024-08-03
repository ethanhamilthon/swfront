import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { MainLogo } from "@/components/icons/logo";

export default function LoginPage() {
  const t = useTranslations("Login");
  return (
    <main className="w-full h-dvh flex bg-white p-6">
      <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center p-6 gap-12 md:gap-20">
        <MainLogo size={1} />
        <div className="flex flex-col gap-6 items-center">
          <h2 className="text-2xl sm:text-4xl font-bold zinc-700">
            {t("Welcome")}
          </h2>
          <span className="text-balance text-center md:max-w-64 sm:text-lg text-base font-light text-zinc-500">
            {t("Next")}
          </span>
        </div>
        <a
          href="/api/googleoauth/login"
          className="flex p-3 gap-3 sm:text-base text-sm items-center justify-center sm:px-8 rounded-md bg-zinc-50 cursor-pointer hover:bg-zinc-200 border border-zinc-200 duration-150"
        >
          <GoogleLogo />
          <span className="text-zinc-700 font-light">{t("Button")}</span>
        </a>
        <Image
          width={800}
          height={800}
          src="/loginill.png"
          alt="Login image"
          className="object-contain rounded-3x md:hidden"
        />
      </div>
      <Image
        width={800}
        height={800}
        src="/loginill.png"
        alt="Login image"
        className="w-1/2 h-full object-contain hidden md:flex rounded-3xl from-rose-50 to-rose-200 bg-gradient-to-br"
      />
    </main>
  );
}

function LegacyLoginPage() {
  const t = useTranslations("Login");
  return (
    <main className="w-full h-dvh flex items-center justify-center bg-zinc-300">
      <div className="w-5/6 sm:max-w-xl bg-white rounded-2xl p-4 py-8 flex flex-col items-center gap-12">
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-lg sm:text-2xl font-bold zinc-700">
            {t("Welcome")}
          </h2>
          <span className="text-balance md:max-w-64 text-center sm:text-base text-xs font-light text-zinc-500">
            {t("Next")}
          </span>
        </div>
        <Link
          href="/api/googleoauth/login"
          className="flex p-3 gap-3 sm:text-base text-sm items-center justify-center sm:px-8 rounded-md bg-zinc-50 cursor-pointer hover:bg-zinc-200 border border-zinc-200 duration-150"
        >
          <GoogleLogo />
          <span className="text-zinc-700 font-light">{t("Button")}</span>
        </Link>
      </div>
    </main>
  );
}

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
