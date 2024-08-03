import { db } from "@/db";
import { pointTable, userTable } from "@/db/schema";
import { Auth } from "@/utils/server/check-token";
import { eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { Logout } from "./_actions";
import Image from "next/image";
import { UpgradeButton } from "@/feature/pricing/button";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const t = await getTranslations("Profile");
  const result = await Auth();
  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, result.id));
  const [points] = await db
    .select()
    .from(pointTable)
    .where(eq(pointTable.user_id, user.id));
  if (
    result.plan !== user.role ||
    result.points_updated !== points.updated_at
  ) {
    console.log(result.plan);
    console.log(user.role);
    console.log(result.points_updated);
    console.log(points.updated_at);
    redirect("/api/update/role");
  }
  return (
    <main className="container p-0 flex justify-center">
      <div className="w-full max-w-lg flex flex-col p-6 gap-2 items-center justify-center">
        <div className="flex items-center p-3 gap-4 rounded-lg justify-between bg-zinc-50 w-full">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-zinc-700">
              {user.full_name}
            </h2>
            <span className="font-light text-sm text-zinc-400">
              {user.email}
            </span>
          </div>
          <Image
            src={user.avatar || ""}
            alt={user.name}
            width={48}
            height={48}
            className="rounded-full w-12 h-12"
          />
        </div>

        <div className="flex flex-col gap-2 w-full p-3 rounded-lg bg-zinc-50">
          <span className="font-light text-sm text-zinc-400">
            {t("Targets")}
          </span>
          <div className="flex gap-2">
            {result.targets.map((lang) => {
              return (
                <div
                  key={lang}
                  className="py-1 px-4 text-sm bg-white rounded-md text-zinc-600 border border-zinc-300"
                >
                  {lang}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex w-full p-3 rounded-lg bg-zinc-50 items-center justify-between">
          <span className="font-medium text-zinc-600">{t("OS")}</span>
          <span className="font-light text-zinc-400">{user.language}</span>
        </div>
        <div className="flex w-full p-3 rounded-lg bg-zinc-50 items-center justify-between">
          <span className="font-medium text-zinc-600">{t("Plan")}</span>
          <span className="font-light text-zinc-400">{user.role}</span>
        </div>
        <div className="flex w-full p-3 rounded-lg bg-zinc-50 items-center justify-between">
          <span className="font-medium text-zinc-600">{t("Points")}</span>
          <span className="font-light text-zinc-400">{points.point}</span>
        </div>
        {user.role !== "premium" && (
          <UpgradeButton path="/app/upgrade">{t("Premium")}</UpgradeButton>
        )}
        <form action={Logout} className="w-full mt-24">
          <button
            type="submit"
            className="px-6 py-3 w-full bg-red-600 text-white rounded-lg "
          >
            {t("Logout")}
          </button>
        </form>
        {/* <ChangeLanguage /> */}
      </div>
    </main>
  );
}
