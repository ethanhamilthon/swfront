import { z } from "zod";

export const ErrorSchema = z.object({
  from: z.string(),
  cause: z.string(),
});

export const VisitSchema = z.object({
  path: z.string().url(),
  user: z.string(),
});
