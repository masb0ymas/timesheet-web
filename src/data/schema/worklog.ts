import { z } from "zod"

export const worklogSchema = z.object({
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

  worked_at: z
    .any({
      required_error: "worked_at is required",
      invalid_type_error: "worked_at must be a string or date",
    })
    .optional(),

  duration: z
    .string({
      required_error: "duration is required",
      invalid_type_error: "duration must be a string",
    })
    .optional(),

  description: z
    .string({
      required_error: "description is required",
      invalid_type_error: "description must be a string",
    })
    .optional(),

  is_billable: z
    .boolean({
      required_error: "is_billable is required",
      invalid_type_error: "is_billable must be a boolean",
    })
    .optional(),
})
