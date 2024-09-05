import { z } from "zod";

export const todoValidation = z.object({
  title: z
    .string()
    .min(1, "title is required")
    .max(100, "title mustn't be more than 100 chars"),
  description: z
    .string()
    .min(1, "description is required")
    .max(500, "description mustn't be more than 500 chars"),
  status: z.boolean(),
  userId: z.string(),
});
