import { CTAButton } from "@/components/common/button";
import { db } from "@/db";
import { pointTable } from "@/db/schema";
import { Auth } from "@/utils/server/check-token";
import { eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export const dynamic = "force-dynamic";
export default async function Nopoints() {
  const t = await getTranslations("NoPoints");
  const result = await Auth();
  const [points] = await db
    .select()
    .from(pointTable)
    .where(eq(pointTable.user_id, result.id));
  return (
    <main className="container max-w-xl flex flex-col items-center gap-16 py-12">
      <div className="flex flex-col gap-4 items-center">
        <h2 className="text-2xl font-bold text-center">
          {t.rich("Title", {
            br: () => <br />,
          })}
        </h2>
        <span className="text-sm font-light text-zinc-400 text-balance text-center">
          {t.rich("Desc", {
            br: () => <br />,
          })}
        </span>
      </div>
      <CTAButton path="/app/upgrade">{t("Upgrade")}</CTAButton>
      <span className="text-zinc-500 flex items-center gap-3">
        <span>{t("Next")}</span>
        <span className="px-3 py-1 bg-violet-700 rounded-md text-white">
          {formatDateWithAddedMonth(new Date(points.updated_at!))}
        </span>
      </span>
    </main>
  );
}

function formatDateWithAddedMonth(date: Date): string {
  date.setUTCMonth(date.getUTCMonth() + 1); // Увеличиваем месяц на один
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Месяцы начинаются с 0, поэтому добавляем 1
  return `${day}.${month}`;
}
