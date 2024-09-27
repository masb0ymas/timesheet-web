import { z } from "zod"

export const projectSchema = z.object({
  name: z
    .string({
      required_error: "name is required",
      invalid_type_error: "name must be a string",
    })
    .min(2, `name can't be empty`),

  description: z
    .string({
      required_error: "description is required",
      invalid_type_error: "description must be a string",
    })
    .min(2, `description can't be empty`),

  owner_id: z
    .string({
      required_error: "owner_id is required",
      invalid_type_error: "owner_id must be a string",
    })
    .nullable(),
})
