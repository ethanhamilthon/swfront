"use server";

import { db } from "@/db";
import { languageTable, pointTable, userTable } from "@/db/schema";
import { Auth } from "@/utils/server/check-token";
import { GenerateJWTToken } from "@/utils/server/generateToken";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { v4 } from "uuid";

export async function UpdateLanguages(Os: string, Target: string[]) {
  const user = await Auth();
  await db
    .update(userTable)
    .set({
      language: Os,
    })
    .where(eq(userTable.id, user.id));
  await db.insert(languageTable).values(
    Target.map((t) => {
      return { id: v4(), name: t, user_id: user.id };
    })
  );
  const token = GenerateJWTToken({
    id: user.id,
    email: user.email,
    targets: Target,
    language: Os,
    points_updated: user.points_updated,
    plan: user.plan,
  });
  cookies().set("Authorization", token);
  redirect("/app");
}

export async function SetLocale(Lang: string) {
  cookies().set("APP_LOCALE", Lang);
}
