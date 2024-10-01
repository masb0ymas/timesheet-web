import { useMutation } from "@tanstack/react-query"
import { queryClient } from "~/components/layouts/core"
import Table from "~/components/ui/tables/reactTable"
import { WorklogEntity } from "~/data/entity/worklog"
import useWorklog from "~/data/query/worklog/useWorklog"
import { worklogColumn } from "./partials/columnDef"

export default function WorklogPage() {
  const query = useWorklog({ skip: 0, take: 10, is_ownerships: true })
  const baseURL = "/worklog"

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      return await fetch(`/api/worklog/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["worklog", "worklog-by-id"] })
    },
  })

  return (
    <Table<WorklogEntity>
      query={query}
      columns={worklogColumn}
      mutation={mutation}
      baseURL={baseURL}
      isEdit
      isDelete
    />
  )
}
