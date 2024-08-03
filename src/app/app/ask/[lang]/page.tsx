import { Auth } from "@/utils/server/check-token";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Ask } from "@/feature/ask";
import { db } from "@/db";
import { pointTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export default async function AskPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang = params.lang;
  if (!lang) {
    redirect("/app");
  }
  const result = await Auth();
  const token = cookies().get("Authorization");
  if (token === null || token?.value === undefined) {
    redirect("/app");
  }
  const [points] = await db
    .select()
    .from(pointTable)
    .where(eq(pointTable.user_id, result.id));
  if (!points.point || points.point <= 0) {
    redirect("/app/nopoints");
  }
  return (
    <Ask
      token={token.value}
      from={result.language!}
      to={params.lang}
      pointcount={points.point}
    />
  );
}
