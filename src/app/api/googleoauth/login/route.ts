import { OAuth2Client } from "google-auth-library";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export function GET(req: NextRequest) {
  const state = req.nextUrl.searchParams.get("state");
  const loginUrl = new OAuth2Client({
    clientId: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    redirectUri: process.env.REDIRECT_URL,
  }).generateAuthUrl({
    access_type: "offline",
    scope: ["email", "profile"],
    state: state || "somestate",
  });
  console.log(state);
  return new Response("", {
    status: 302, // Статус редиректа
    headers: {
      Location: loginUrl, // Новый URL для редиректа
    },
  });
}
