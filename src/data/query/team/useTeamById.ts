"use client"

import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { TeamEntity } from "~/data/entity/team"

type UseResult = TeamEntity

type TQueryFnData = UseResult
type TError = any

/**
 *
 * @param options
 * @returns
 */
export default function useTeamById(id: string, options?: UseQueryOptions<TQueryFnData, TError>) {
  const query = useQuery<TQueryFnData, TError>({
    queryKey: ["team-by-id", id],
    queryFn: async () => {
      const result = await fetch(`/api/team/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      return result.json()
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    select: (res: any) => res?.data,
    enabled: Boolean(id),
    ...options,
  })

  return {
    ...query,
  }
}
