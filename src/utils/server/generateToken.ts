import { z } from "zod";
import jwt from "jsonwebtoken";

export const JWTSchema = z.object({
  id: z.string().min(10),
  email: z.string().min(1),
  language: z.string().optional(),
  targets: z.array(z.string()),
  points_updated: z.string().optional(),
  plan: z.string(),
});

type JWTDataType = z.infer<typeof JWTSchema>;

export function GenerateJWTToken(data: JWTDataType): string {
  const jwtkey = process.env.JWT_SECRET;
  if (!jwtkey) {
    return "";
  }
  const token = jwt.sign(JSON.stringify(data), jwtkey);
  return token;
}
