import { cn } from "@/lib/utils";
import { isAuthed } from "@/utils/server/check-token";
import { CheckIcon, RocketIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ReactNode } from "react";

export function Pricing() {
  const user = isAuthed();
  return (
    <div className="flex sm:flex-row flex-col w-full px-6 max-w-3xl items-center sm:items-start justify-center gap-4">
      <FreePlanBlock currentPlan={user && user.plan} />
      <PremiumPlanBlock currentPlan={user && user.plan} />
    </div>
  );
}

function FreePlanBlock({ currentPlan }: { currentPlan?: string | null }) {
  const t = useTranslations("Pricing.Free");
  return (
    <div className="w-full flex-1 flex flex-col rounded-2xl border border-zinc-300">
      <div className="p-4 flex flex-col gap-7">
        <h3 className="text-lg font-medium text-zinc-800">{t("Title")}</h3>
        <div className="flex gap-1">
          <span className="text-4xl font-bold text-zinc-800">{t("Price")}</span>
          <span className="text-sm text-zinc-600 mt-1">{t("PriceLabel")}</span>
        </div>
        <span className="text-zinc-800 text-balance text-sm">{t("Desc")}</span>
        {currentPlan === "free" ? (
          <YourPlanButton />
        ) : (
          <Link
            href="/app"
            className="w-full py-3 flex items-center gap-3 justify-center rounded-lg border border-zinc-500 text-zinc-500 font-medium"
          >
            {t("Button")}
          </Link>
        )}
      </div>
      <div id="line" className="h-[1px] w-full bg-zinc-300" />
      <div className="p-4 flex flex-col gap-7">
        <h4 className="text-lg font-medium">{t("YouGet")}</h4>
        <div className="flex flex-col gap-2">
          <FeatureText>{t("T1")}</FeatureText>
          <FeatureText>{t("T2")}</FeatureText>
          <FeatureText>{t("T3")}</FeatureText>
          <FeatureText notAccess>{t("T4")}</FeatureText>
          <FeatureText notAccess>{t("T5")}</FeatureText>
          <FeatureText notAccess>{t("T6")}</FeatureText>
        </div>
      </div>
    </div>
  );
}

function PremiumPlanBlock({ currentPlan }: { currentPlan?: string | null }) {
  const t = useTranslations("Pricing.Premium");
  const user = isAuthed();
  const urlToPay =
    user === null
      ? "/app"
      : process.env.STRIPE_URL + "?prefilled_email=" + user.email;
  return (
    <div className="w-full flex-1 flex flex-col rounded-2xl border border-zinc-300 relative">
      <span className="py-1.5 px-4 flex items-center gap-2 text-sm text-white bg-violet-500 rounded-lg absolute top-2 right-2">
        <RocketIcon width={14} height={14} />
        {t("Best")}
      </span>
      <div className="p-4 flex flex-col gap-7">
        <h3 className="text-lg font-medium text-zinc-800">{t("Title")}</h3>
        <div className="flex gap-1">
          <span className="text-4xl font-bold text-zinc-800">{t("Price")}</span>
          <span className="text-sm text-zinc-600 mt-1">{t("PriceLabel")}</span>
        </div>
        <span className="text-zinc-800 text-balance text-sm">{t("Desc")}</span>
        {currentPlan === "premium" ? (
          <YourPlanButton />
        ) : (
          <Link
            href={urlToPay}
            target={urlToPay !== "/app" ? "_blank" : "_self"}
            className="w-full py-3 flex items-center gap-3 justify-center rounded-lg bg-gradient-to-br from-violet-400 to-violet-600 text-white font-medium"
          >
            {t("Button")}
          </Link>
        )}
      </div>
      <div id="line" className="h-[1px] w-full bg-zinc-300" />
      <div className="p-4 flex flex-col gap-7">
        <h4 className="text-lg font-medium">{t("YouGet")}</h4>
        <div className="flex flex-col gap-2">
          <FeatureText>{t("T1")}</FeatureText>
          <FeatureText>{t("T2")}</FeatureText>
          <FeatureText>{t("T3")}</FeatureText>
          <FeatureText>{t("T4")}</FeatureText>
          <FeatureText>{t("T5")}</FeatureText>
          <FeatureText>{t("T6")}</FeatureText>
          <FeatureText>{t("T7")}</FeatureText>
          {/* <FeatureText>{t("T8")}</FeatureText> */}
        </div>
      </div>
    </div>
  );
}

function FeatureText({
  children,
  notAccess,
}: {
  children: ReactNode;
  notAccess?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "bg-violet-400 w-5 h-5 flex rounded-full justify-center items-center",
          {
            "bg-zinc-400": notAccess,
          }
        )}
      >
        <CheckIcon className="text-white" />
      </div>
      <span
        className={cn("text-zinc-600", {
          "line-through text-zinc-400": notAccess,
        })}
      >
        {children}
      </span>
    </div>
  );
}

function YourPlanButton() {
  const t = useTranslations("Pricing");
  return (
    <div className="w-full py-3 flex items-center gap-3 justify-center rounded-lg border border-zinc-300 text-zinc-300 font-medium">
      {t("Current")}
    </div>
  );
}
