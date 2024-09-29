import { useFormik } from "formik"
import _ from "lodash"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import { Input, Label } from "~/components/ui/input"
import { loginSchema } from "~/schema/auth"

export default function LoginPage() {
  const [errMessage, setErrMessage] = useState("")

  const initialValues: z.infer<typeof loginSchema> = {
    email: "",
    password: "",
  }

  const formik = useFormik<z.infer<typeof loginSchema>>({
    initialValues,
    validate: (values) => {
      try {
        loginSchema.parse(values)
      } catch (error: any) {
        console.log(error)
        return error.formErrors.fieldErrors
      }
    },
    onSubmit: async (values, { setSubmitting }) => {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (!_.isNil(res?.error) && !_.isEmpty(res?.error) && res.status !== 200) {
        setErrMessage(res?.error)
      }

      setSubmitting(false)
    },
  })

  return (
    <main className="min-h-full flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-slate-100">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email address</Label>
            <div className="mt-2">
              <Input
                placeholder="name@example.com"
                type="email"
                id="email"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {formik.touched.email || formik.errors.email ? (
                <div className="text-red-500">{formik.errors.email}</div>
              ) : null}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <Input
                placeholder="••••••••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              {formik.touched.password || formik.errors.password ? (
                <div className="text-red-500">{formik.errors.password}</div>
              ) : null}
            </div>
          </div>

          <div>
            <Button fullWidth type="submit" disabled={formik.isSubmitting}>
              Login
            </Button>
          </div>

          {errMessage && <p className="text-red-500">{errMessage}</p>}
        </form>
      </div>
    </main>
  )
}
