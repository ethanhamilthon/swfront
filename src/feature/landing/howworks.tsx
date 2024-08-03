import {
  LetterCaseCapitalizeIcon,
  LoopIcon,
  MagicWandIcon,
  MixIcon,
} from "@radix-ui/react-icons";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import { useTranslations } from "next-intl";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export function HowStart() {
  const t = useTranslations("Landing.Works");
  return (
    <section
      id="works"
      className="container  py-16 flex flex-col items-center gap-12"
    >
      <h3 className="text-3xl text-center font-bold ">
        {t.rich("Title", {
          br: () => <br />,
        })}
      </h3>
      <div className="flex flex-wrap flex-col sm:flex-row w-full gap-8 sm:gap-4">
        <Step num={1} text={t("T1")} Icon={LetterCaseCapitalizeIcon} />
        <Step num={2} text={t("T2")} Icon={LoopIcon} />
        <Step num={3} text={t("T3")} Icon={MixIcon} />
        <Step num={4} text={t("T4")} Icon={MagicWandIcon} />
      </div>
    </section>
  );
}

export function Step({
  num,
  text,
  Icon,
}: {
  num: number;
  text: string;
  Icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
}) {
  return (
    <div className="flex items-center flex-1 gap-3 bg-violet-50/50 rounded-lg py-6 px-6 justify-between pl-16 relative">
      <span className="text-7xl font-bold text-violet-200 italic left-1 top-1/2 -translate-y-1/2 absolute">
        {num}
      </span>
      <span className="leading-5 font-medium text-zinc-600 text-wrap flex-1">
        {text}
      </span>
      <div className="w-10 h-10 bg-violet-200 rounded-lg flex items-center justify-center">
        <Icon width={24} height={24} className="text-violet-800" />
      </div>
    </div>
  );
}
