import { db } from "@/db";
import { pointTable } from "@/db/schema";
import { CalculatePoints } from "@/utils/server/calculate-points";
import { Auth } from "@/utils/server/check-token";
import { Is30Days } from "@/utils/server/date";
import { GenerateJWTToken } from "@/utils/server/generateToken";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const user = await Auth();
  const Is30DaysAlready = Is30Days(user.points_updated || "");
  if (Is30DaysAlready) {
    const today = new Date().toISOString();
    await db
      .update(pointTable)
      .set({
        point: CalculatePoints(user.plan),
        updated_at: today,
      })
      .where(eq(pointTable.user_id, user.id));
    const token = GenerateJWTToken({
      ...user,
      points_updated: today,
    });
    return new Response("", {
      status: 302, // Статус редиректа
      headers: {
        Location: "/app", // Новый URL для редиректа
        "Set-Cookie": `Authorization=${token}; Path=/;`, // Установка куки
      },
    });
  } else {
    return new Response("", {
      status: 302, // Статус редиректа
      headers: {
        Location: "/app", // Новый URL для редиректа
      },
    });
  }
}
