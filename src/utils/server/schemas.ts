import { z } from "zod";

export const ErrorSchema = z.object({
  from: z.string(),
  cause: z.string(),
});
