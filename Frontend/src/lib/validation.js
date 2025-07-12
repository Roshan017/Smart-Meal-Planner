import { z } from "zod";

export const SigninValidation = z.object({
  email: z.string().email("Enter email correctly"),
  password: z.string().min(0, "Password must be at least 8 characters long"),
});