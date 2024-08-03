import { z } from "zod";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { languageTable, pointTable, userTable } from "@/db/schema";
import { v4 } from "uuid";
import { eq } from "drizzle-orm";
import { GenerateJWTToken } from "@/utils/server/generateToken";
import { OAuth2Client } from "google-auth-library";
import { CalculatePoints } from "@/utils/server/calculate-points";
import { newErrorEvent } from "@/utils/server/events";

const UserDataSchema = z.object({
  sub: z.string(),
  name: z.string(),
  given_name: z.string(),
  family_name: z.string(),
  picture: z.string().url(), // Проверка на корректный URL
  email: z.string().email(), // Проверка на корректный email
  email_verified: z.boolean(),
});
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const queryParams = new URLSearchParams(req.url);
  const url = req.nextUrl.clone();
  const now = new Date().toISOString();
  try {
    const code = queryParams.get("code");
    if (code === null) {
      throw new Error("error get code and state");
    }

    const cred = await new OAuth2Client({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      redirectUri: process.env.REDIRECT_URL,
    }).getToken(code);
    if (typeof cred.tokens.access_token !== "string") {
      throw new Error("error get token");
    }

    const data = await getUserData(cred.tokens.access_token);
    const userData = UserDataSchema.parse(data);
    const userDataFromRepo = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, userData.email));
    if (userDataFromRepo.length !== 0) {
      const userLangs = await db
        .select()
        .from(languageTable)
        .where(eq(languageTable.user_id, userDataFromRepo[0].id));
      const userPoints = await db
        .select()
        .from(pointTable)
        .where(eq(pointTable.user_id, userDataFromRepo[0].id));
      if (userPoints.length === 0) {
        await db.insert(pointTable).values({
          id: v4(),
          point: CalculatePoints(userDataFromRepo[0].role),
          created_at: now,
          updated_at: now,
          user_id: userDataFromRepo[0].id,
        });
        const jwttoken = GenerateJWTToken({
          id: userDataFromRepo[0].id,
          email: userDataFromRepo[0].email,
          plan: userDataFromRepo[0].role || "free",
          targets: userLangs.map((l) => l.name),
          language: userDataFromRepo[0].language || "",
          points_updated: now,
        });
        return new Response("", {
          status: 302, // Статус редиректа
          headers: {
            Location: "/app", // Новый URL для редиректа
            "Set-Cookie": `Authorization=${jwttoken}; Path=/;`, // Установка куки
          },
        });
      }
      const jwttoken = GenerateJWTToken({
        id: userDataFromRepo[0].id,
        email: userDataFromRepo[0].email,
        plan: userDataFromRepo[0].role || "free",
        targets: userLangs.map((l) => l.name),
        language: userDataFromRepo[0].language || "",
        points_updated: userPoints[0].updated_at || "",
      });
      return new Response("", {
        status: 302, // Статус редиректа
        headers: {
          Location: "/app", // Новый URL для редиректа
          "Set-Cookie": `Authorization=${jwttoken}; Path=/;`, // Установка куки
        },
      });
    }
    const id = v4();
    await db.insert(userTable).values({
      id: id,
      name: userData.given_name,
      full_name: userData.name,
      email: userData.email,
      avatar: userData.picture,
    });
    await db.insert(pointTable).values({
      id: v4(),
      point: 50,
      user_id: id,
      updated_at: now,
    });
    const jwttoken = GenerateJWTToken({
      id: id,
      email: userData.email,
      plan: "free",
      targets: [],
      points_updated: now,
    });
    return new Response("", {
      status: 302, // Статус редиректа
      headers: {
        Location: "/app", // Новый URL для редиректа
        "Set-Cookie": `Authorization=${jwttoken}; Path=/;`, // Установка куки
      },
    });
  } catch (error) {
    await newErrorEvent("google oauth callback", JSON.stringify(error));
    return new Response("", {
      status: 302, // Статус редиректа
      headers: {
        Location: "/", // Новый URL для редиректа
      },
    });
  }
}

async function getUserData(token: string) {
  const res = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
  );
  const data = await res.json();
  return data;
}
