import { useTranslations } from "next-intl";
import { JSXElementConstructor, ReactElement, ReactNodeArray } from "react";

export const LandingStats = () => {
  const t = useTranslations("Landing.Stats");
  return (
    <section
      id="stats"
      className="container py-16 flex sm:flex-row px-12 sm:px-4 flex-col flex-wrap gap-20 md:gap-16 lg:gap-8 sm:justify-around items-start sm:items-center  border-b border-b-zinc-300"
    >
      <Stat
        main={t("First.Main")}
        label={t("First.Label")}
        desc={t.rich("First.Desc", {
          br: () => <br />,
        })}
      />
      <Stat
        main={t("Second.Main")}
        label={t("Second.Label")}
        desc={t.rich("Second.Desc", {
          br: () => <br />,
        })}
      />
      <Stat
        main={t("Third.Main")}
        label={t("Third.Label")}
        desc={t.rich("Third.Desc", {
          br: () => <br />,
        })}
      />
    </section>
  );
};

const Stat = ({
  main,
  label,
  desc,
}: {
  main: string;
  label: string;
  desc:
    | string
    | ReactElement<any, string | JSXElementConstructor<any>>
    | ReactNodeArray;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold">{main}</span>
        <span>{label}</span>
      </div>
      <p className="text-xs font-light">{desc}</p>
    </div>
  );
};
