import React from "react"

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>
type InputProps = React.InputHTMLAttributes<HTMLInputElement>
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export function Input(props: InputProps) {
  return (
    <input
      className="block w-full rounded-lg border-0 dark:border-1 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-transparent dark:border-slate-700 dark:placeholder:text-slate-400 dark:text-slate-100"
      {...props}
    />
  )
}

export function Textarea(props: TextareaProps) {
  return (
    <textarea
      className="block w-full rounded-lg border-0 dark:border-1 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-transparent dark:border-slate-700 dark:placeholder:text-slate-400 dark:text-slate-100"
      {...props}
    />
  )
}

export function Label(props: LabelProps) {
  return (
    <label
      className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-100"
      {...props}
    >
      {props.children}
    </label>
  )
}
