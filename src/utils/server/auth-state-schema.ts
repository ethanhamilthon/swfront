import { z } from "zod";

export const AuthStateSchema = z.object({
  from_language: z.string(),
  to_language: z.string(),
});
