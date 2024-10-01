import { z } from "zod"

export const teamSchema = z.object({
  user_id: z
    .string({
      required_error: "user_id is required",
      invalid_type_error: "user_id must be a string",
    })
    .min(2, `user_id can't be empty`),

  project_id: z
    .string({
      required_error: "project_id is required",
      invalid_type_error: "project_id must be a string",
    })
    .min(2, `project_id can't be empty`)
    .optional(),

  remaining_time: z
    .string({
      required_error: "remaining_time is required",
      invalid_type_error: "remaining_time must be a string",
    })
    .optional(),
})
