import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { queryClient } from '~/components/layouts/core'
import Table from '~/components/ui/tables/reactTable'
import { TeamEntity } from '~/data/entity/team'
import useTeam from '~/data/query/team/useTeam'
import { teamColumn } from './partials/columnDef'

export default function TeamPage() {
  const query = useTeam()
  const baseURL = "/team"

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      return await fetch(`/api/team/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["team", "team-by-id"] })
    },
  })

  return (
    <Table<TeamEntity>
      query={query}
      columns={teamColumn}
      mutation={mutation}
      baseURL={baseURL}
      isEdit
      isDelete
    />
  )
}
