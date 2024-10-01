import clsx from "clsx"
import React from "react"
import SVGLoader from "~/components/svg/loader"

interface IProps {
  fullWidth?: boolean
  styleProps?: string
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & IProps
type ButtonInputProps = React.InputHTMLAttributes<HTMLInputElement> & IProps

export function Button(props: ButtonProps) {
  let variant = "text-white bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600"

  if (props.variant === "outline") {
    variant =
      "border text-indigo-600 border-indigo-600 hover:text-white hover:bg-indigo-500 focus-visible:outline-indigo-600 transition duration-150 ease-in-out"
  }

  if (props.variant === "ghost") {
    variant =
      "text-indigo-600 hover:text-white hover:bg-indigo-500 focus-visible:outline-indigo-600 transition duration-150 ease-in-out"
  }

  return (
    <button
      className={clsx(
        "flex",
        props.fullWidth ? "w-full" : "w-fit",
        variant,
        "justify-center items-center rounded-lg px-3 py-2 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ",
        props.styleProps
      )}
      {...props}
    >
      {props.loading && <SVGLoader />}
      {props.children}
    </button>
  )
}

export function ButtonInput(props: ButtonInputProps) {
  let variant = "text-white bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600"

  if (props.variant === "outline") {
    variant =
      "border text-indigo-600 border-indigo-600 hover:text-white hover:bg-indigo-500 focus-visible:outline-indigo-600 transition duration-150 ease-in-out"
  }

  if (props.variant === "ghost") {
    variant =
      "text-indigo-600 hover:text-white hover:bg-indigo-500 focus-visible:outline-indigo-600 transition duration-150 ease-in-out"
  }

  return (
    <input
      className={clsx(
        "flex",
        props.fullWidth ? "w-full" : "w-fit",
        variant,
        "justify-center items-center rounded-lg px-3 py-2 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ",
        props.styleProps
      )}
      type="submit"
      value={props.name}
      {...props}
    />
  )
}
