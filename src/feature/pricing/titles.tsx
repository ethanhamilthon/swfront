import { useTranslations } from "next-intl";

export function PricingTitles() {
  const t = useTranslations("Pricing");
  return (
    <div className="w-full flex flex-col gap-4 items-center">
      <h3 className="text-3xl font-bold text-zinc-900 text-center">
        {t.rich("Title", {
          br: () => <br />,
        })}
      </h3>
      <span className="text-sm font-light text-zinc-600 text-center">
        {t.rich("SubTitle", {
          br: () => <br />,
        })}
      </span>
    </div>
  );
}
