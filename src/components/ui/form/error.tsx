import { FormikErrors } from "formik"
import { isArray } from "lodash"

/**
 *
 * @param field
 * @returns
 */
export default function customErrors(errors: FormikErrors<any>, field: string) {
  // @ts-expect-error
  const errorField: string | string[] = errors[field]

  let result

  if (isArray(errorField)) {
    result = errorField.map((message) => {
      return (
        <span className="text-red-500 text-sm mt-1" key={message}>
          {message}
          <br />
        </span>
      )
    })
  } else {
    result = <span className="text-red-500 text-sm mt-1">{errorField}</span>
  }

  return result
}
