import React from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export default function Button(props: ButtonProps) {
  return (
    <button
      className="flex w-fit items-center bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg px-4 py-2 font-bold"
      {...props}
    >
      {props.children}
    </button>
  )
}
