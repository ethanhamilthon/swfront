import { db } from "@/db";
import { pointTable, userTable } from "@/db/schema";
import { isAuthed } from "@/utils/server/check-token";
import { newErrorEvent } from "@/utils/server/events";
import { GenerateJWTToken } from "@/utils/server/generateToken";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const GET = async () => {
  try {
    const userauth = isAuthed();
    if (!userauth) {
      redirect("/app");
    }
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userauth.id));
    const [points] = await db
      .select()
      .from(pointTable)
      .where(eq(pointTable.user_id, userauth.id));
    if (
      userauth.plan !== user.role ||
      userauth.points_updated !== points.updated_at
    ) {
      const jwttoken = GenerateJWTToken({
        id: user.id,
        email: user.email,
        language: user.language!,
        plan: user.role!,
        targets: userauth.targets,
        points_updated: points.updated_at!,
      });

      return new Response("", {
        status: 302, // Статус редиректа
        headers: {
          Location: "/app", // Новый URL для редиректа
          "Set-Cookie": `Authorization=${jwttoken}; Path=/; HttpOnly`, // Установка куки
        },
      });
    }
  } catch (error) {
    await newErrorEvent("role route", JSON.stringify(error));
    return new Response("", {
      status: 302, // Статус редиректа
      headers: {
        Location: "/app", // Новый URL для редиректа
      },
    });
  }
};
