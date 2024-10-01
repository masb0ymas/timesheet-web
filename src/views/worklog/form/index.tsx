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
import Loader from "~/components/ui/loader"
import useProject from "~/data/query/project/useProject"
import useWorklogById from "~/data/query/worklog/useWorklogById"
import { worklogSchema } from "~/data/schema/worklog"

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
  const baseURL = `/worklog`

  const { data: projects } = useProject()

  const formik = useFormik<z.infer<typeof worklogSchema>>({
    initialValues,
    validate: (values) => {
      try {
        worklogSchema.parse(values)
      } catch (error: any) {
        console.log(error)
        return error.formErrors.fieldErrors
      }
    },
    onSubmit: async (values, { setSubmitting }) => {
      console.log(values)
      const newValues = {
        ...values,
        worked_at: new Date(String(values.worked_at)),
      }

      try {
        const res = await mutation.mutateAsync(newValues)
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

      <div>
        <Label htmlFor="worked_at">Worked At</Label>
        <div className="mt-2">
          <Input
            placeholder="4h"
            type="date"
            id="worked_at"
            onChange={formik.handleChange}
            value={formik.values.worked_at}
          />
          {formik.touched.worked_at || formik.errors.worked_at
            ? customErrors(formik.errors, "worked_at")
            : null}
        </div>
      </div>

      <div>
        <Label htmlFor="duration">Duration</Label>
        <div className="mt-2">
          <Input
            placeholder="4h"
            type="text"
            id="duration"
            onChange={formik.handleChange}
            value={formik.values.duration}
          />
          {formik.touched.duration || formik.errors.duration
            ? customErrors(formik.errors, "duration")
            : null}
        </div>
      </div>

      <div className="flex flex-row gap-2">
        <input
          type="checkbox"
          id="is_billable"
          onChange={formik.handleChange}
          checked={formik.values.is_billable}
          className="block mt-1 rounded-lg border-0 dark:border-1 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-transparent dark:border-slate-700 dark:placeholder:text-slate-400 dark:text-slate-100"
        />
        <Label htmlFor="is_billable" styleProps="items-center justify-center">
          Billable
        </Label>
        <div className="mt-2">
          {formik.touched.is_billable || formik.errors.is_billable
            ? customErrors(formik.errors, "is_billable")
            : null}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <div className="mt-2">
          <Textarea
            placeholder="Description Worklog"
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

      <Button type="submit" disabled={formik.isSubmitting} loading={formik.isSubmitting}>
        {isEdit ? "Update" : "Submit"}
      </Button>

      {errMessage && <span className="text-red-500 text-sm mt-1">{errMessage}</span>}
    </form>
  )
}

export function FormAdd() {
  const { data: session } = useSession()

  const initialValues: z.infer<typeof worklogSchema> = {
    user_id: session?.user?.id,
    project_id: undefined,
    remaining_time: undefined,
    worked_at: undefined,
    duration: undefined,
    description: undefined,
    is_billable: false,
  }

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof worklogSchema>) => {
      return await fetch("/api/worklog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["worklog", "worklog-by-id"] })
    },
  })

  return <AbstractForm initialValues={initialValues} mutation={mutation} />
}

export function FormEdit() {
  const { data: session } = useSession()
  const router = useRouter()

  const id = _.get(router, "query.id", "") as string
  const isEdit = Boolean(id)

  const { data, isLoading } = useWorklogById(id)

  const initialValues: z.infer<typeof worklogSchema> = {
    user_id: session?.user?.id,
    project_id: String(data?.project_id),
    remaining_time: String(data?.remaining_time),
    worked_at: new Date(String(data?.worked_at)),
    duration: String(data?.duration),
    description: String(data?.description),
    is_billable: Boolean(data?.is_billable),
  }

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof worklogSchema>) => {
      return await fetch(`/api/worklog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["worklog", "worklog-by-id"] })
    },
  })

  if (isLoading) {
    return <Loader />
  }

  return <AbstractForm initialValues={initialValues} mutation={mutation} isEdit={isEdit} />
}
