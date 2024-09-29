import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "email is required",
      invalid_type_error: "email must be a string",
    })
    .email(`email must be a valid email address`)
    .min(2, `email can't be empty`),

  password: z
    .string({
      required_error: "password is required",
      invalid_type_error: "password must be a string",
    })
    .min(2, `password can't be empty`),
})
