"use server";

import { cookies } from "next/headers";

export async function LocalChangeAction(value: string) {
  cookies().set("APP_LOCALE", value);
}
