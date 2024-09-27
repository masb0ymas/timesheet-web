import React from "react"

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>
type InputProps = React.InputHTMLAttributes<HTMLInputElement>
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export function Input(props: InputProps) {
  return <input className="block w-full rounded-lg p-2 border-[2px]" {...props} />
}

export function Textarea(props: TextareaProps) {
  return <textarea className="block w-full rounded-lg p-2 border-[2px]" {...props} />
}

export function Label(props: LabelProps) {
  return (
    <label className="block text-base font-medium text-gray-900 dark:text-slate-100" {...props}>
      {props.children}
    </label>
  )
}
