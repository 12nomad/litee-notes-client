import { z } from "zod";

export const registerValidationSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    passwordConfirmation: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Password don't match",
  });

export type RegisterValidationSchema = z.infer<typeof registerValidationSchema>;

export const logInValidationSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type LogInValidationSchema = z.infer<typeof logInValidationSchema>;
