"use client"

import { useMutation } from "@tanstack/react-query"
import { useFormik } from "formik"
import _ from "lodash"
import { useSession } from "next-auth/react"
import Router, { useRouter } from "next/router"
import { useState } from "react"
import { z } from "zod"
import { queryClient } from "~/components/layouts/core"
import { Button } from "~/components/ui/button"
import customErrors from "~/components/ui/form/error"
import { Input, Label, Textarea } from "~/components/ui/input"
import useProjectById from "~/data/query/project/useProjectById"
import { projectSchema } from "~/data/schema/project"

interface AbstractFormProps {
  initialValues: any
  mutation: ReturnType<typeof useMutation<any, any, any, any>>
  isEdit?: boolean
}

/**
 *
 * @param {AbstractFormProps} props
 * @returns
 */
function AbstractForm(props: AbstractFormProps) {
  const { initialValues, mutation, isEdit = false } = props
  const [errMessage, setErrMessage] = useState("")
  const baseURL = `/project`

  const formik = useFormik<z.infer<typeof projectSchema>>({
    initialValues,
    validate: (values) => {
      try {
        projectSchema.parse(values)
      } catch (error: any) {
        console.log(error)
        return error.formErrors.fieldErrors
      }
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await mutation.mutateAsync(values)
        console.log(res)

        Router.push(baseURL)
      } catch (error: any) {
        if (!_.isNil(error) && !_.isEmpty(error)) {
          setErrMessage(error.message)
        }
      }

      setSubmitting(false)
    },
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <div className="mt-2">
          <Input
            placeholder="Project name"
            type="text"
            id="name"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          {formik.touched.name || formik.errors.name ? customErrors(formik.errors, "name") : null}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <div className="mt-2">
          <Textarea
            placeholder="Description project"
            id="description"
            rows={4}
            cols={50}
            onChange={formik.handleChange}
            value={formik.values.description}
          />
          {formik.touched.description || formik.errors.description
            ? customErrors(formik.errors, "description")
            : null}
        </div>
      </div>

      <Button type="submit" disabled={formik.isSubmitting}>
        {isEdit ? "Update" : "Submit"}
      </Button>

      {errMessage && <span className="text-red-500 text-sm mt-1">{errMessage}</span>}
    </form>
  )
}

export function FormAdd() {
  const { data: session } = useSession()

  const initialValues: z.infer<typeof projectSchema> = {
    name: "",
    description: "",
    owner_id: session?.user?.id,
  }

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof projectSchema>) => {
      return await fetch("/api/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["project", "project-by-id"] })
    },
  })

  return <AbstractForm initialValues={initialValues} mutation={mutation} />
}

export function FormEdit() {
  const { data: session } = useSession()
  const router = useRouter()

  const id = _.get(router, "query.id", "") as string
  const isEdit = Boolean(id)

  const { data } = useProjectById(id)

  const initialValues: z.infer<typeof projectSchema> = {
    name: String(data?.name),
    description: String(data?.description),
    owner_id: session?.user?.id,
  }

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof projectSchema>) => {
      return await fetch(`/api/project/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["project", "project-by-id"] })
    },
  })

  return <AbstractForm initialValues={initialValues} mutation={mutation} isEdit={isEdit} />
}
