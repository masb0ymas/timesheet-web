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
import { Input, Label } from "~/components/ui/input"
import Loader from "~/components/ui/loader"
import useProject from "~/data/query/project/useProject"
import useTeamById from "~/data/query/team/useTeamById"
import { teamSchema } from "~/data/schema/team"

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
  const baseURL = `/team`

  const { data: projects } = useProject()

  const formik = useFormik<z.infer<typeof teamSchema>>({
    initialValues,
    validate: (values) => {
      try {
        teamSchema.parse(values)
      } catch (error: any) {
        console.log(error)
        return error.formErrors.fieldErrors
      }
    },
    onSubmit: async (values, { setSubmitting }) => {
      console.log(values)

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
        <Label htmlFor="project_id">Project</Label>
        <div className="mt-2">
          <select
            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            name="project_id"
            id="project_id"
            onChange={formik.handleChange}
            value={formik.values.project_id}
          >
            <option value="">Select a project</option>
            {!_.isEmpty(projects) &&
              projects.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                )
              })}
          </select>
          {formik.touched.project_id || formik.errors.project_id
            ? customErrors(formik.errors, "project_id")
            : null}
        </div>
      </div>

      <div>
        <Label htmlFor="remaining_time">Remaining Time</Label>
        <div className="mt-2">
          <Input
            placeholder="4h"
            type="text"
            id="remaining_time"
            onChange={formik.handleChange}
            value={formik.values.remaining_time}
          />
          {formik.touched.remaining_time || formik.errors.remaining_time
            ? customErrors(formik.errors, "remaining_time")
            : null}
        </div>
      </div>

      <Button type="submit" disabled={formik.isSubmitting} loading={formik.isSubmitting}>
        {isEdit ? "Update" : "Submit"}
      </Button>

      {errMessage && <span className="text-red-500 text-sm mt-1">{errMessage}</span>}
    </form>
  )
}

export function FormAdd() {
  const { data: session } = useSession()

  const initialValues: z.infer<typeof teamSchema> = {
    user_id: session?.user?.id,
    project_id: undefined,
    remaining_time: undefined,
  }

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof teamSchema>) => {
      return await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["team", "team-by-id"] })
    },
  })

  return <AbstractForm initialValues={initialValues} mutation={mutation} />
}

export function FormEdit() {
  const { data: session } = useSession()
  const router = useRouter()

  const id = _.get(router, "query.id", "") as string
  const isEdit = Boolean(id)

  const { data, isLoading } = useTeamById(id)

  const initialValues: z.infer<typeof teamSchema> = {
    user_id: session?.user?.id,
    project_id: String(data?.project_id),
    remaining_time: String(data?.remaining_time),
  }

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof teamSchema>) => {
      return await fetch(`/api/team/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["team", "team-by-id"] })
    },
  })

  if (isLoading) {
    return <Loader />
  }

  return <AbstractForm initialValues={initialValues} mutation={mutation} isEdit={isEdit} />
}
