import { OAuth2Client } from "google-auth-library";

export const GoogleClient = new OAuth2Client({
  clientId: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  redirectUri: process.env.REDIRECT_URL,
});
