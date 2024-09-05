import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username must contain at least 2 chars")
  .max(20, "username mustn't be more than 20 chars");

export const registerValidation = z.object({
  username: usernameValidation,
  password: z.string().min(4, { message: "password must be at least 4 chars" }),
});
