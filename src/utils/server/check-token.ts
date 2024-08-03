import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { JWTSchema } from "./generateToken";

export function isAuthed() {
  const token = cookies().get("Authorization");
  if (token === undefined) {
    return null;
  }
  const jwtkey = process.env.JWT_SECRET;
  if (jwtkey === undefined) {
    return null;
  }
  try {
    const cl = jwt.verify(token.value, jwtkey);
    const claims = JWTSchema.safeParse(cl);
    if (!claims.success) {
      return null;
    }
    return claims.data;
  } catch (error) {
    return null;
  }
}

export async function Auth() {
  const token = cookies().get("Authorization");
  if (token === undefined) {
    redirect("/login");
  }
  const jwtkey = process.env.JWT_SECRET;
  if (jwtkey === undefined) {
    redirect("/app");
  }
  try {
    const cl = jwt.verify(token.value, jwtkey);
    const claims = JWTSchema.safeParse(cl);
    if (!claims.success) {
      redirect("/login");
    }
    return claims.data;
  } catch (error) {
    redirect("/login");
  }
}
