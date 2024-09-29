import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import { Input, Label, Textarea } from "~/components/ui/input"
import { projectSchema } from "~/schema/project"

interface AbstractFormProps {
  initialValues: any
}

function AbstractForm({ initialValues }: AbstractFormProps) {
  const [visible, setVisible] = useState(false)

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialValues,
  })

  async function onSubmit(values: z.infer<typeof projectSchema>) {
    setVisible(true)
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)

    try {
      await fetch(`/api/project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
    } catch (error) {
      console.log(error)
    } finally {
      setVisible(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div style={{ paddingBottom: "1rem" }}>
        <Label htmlFor="name" id="name">
          <span>Name</span>
          <span className="text-red-500 pl-2">*</span>
        </Label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <Input id="name" type="text" {...form.register("name")} />
        </div>
      </div>

      <div style={{ paddingBottom: "1rem" }}>
        <Label htmlFor="description">Description</Label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <Textarea id="description" rows={4} cols={50} {...form.register("description")} />
        </div>
      </div>

      <Button type="submit" disabled={visible}>
        Submit
      </Button>
    </form>
  )
}

export function FormAdd() {
  return <AbstractForm initialValues={{ name: "", description: "", owner_id: "" }} />
}
