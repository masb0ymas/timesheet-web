"use client"

import { useMutation } from "@tanstack/react-query"
import { queryClient } from "~/components/layouts/core"
import Table from "~/components/ui/tables/reactTable"
import { ProjectEntity } from "~/data/entity/project"
import useProject from "~/data/query/project/useProject"
import { projectColumn } from "./partials/columnDef"

export default function ProjectPage() {
  const query = useProject()
  const baseURL = "/project"

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      return await fetch(`/api/project/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["project", "project-by-id"] })
    },
  })

  return (
    <Table<ProjectEntity>
      query={query}
      columns={projectColumn}
      mutation={mutation}
      baseURL={baseURL}
      isEdit
      isDelete
    />
  )
}
