"use client"

import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { TeamEntity } from "~/data/entity/team"

interface UseResult {
  data: TeamEntity[]
  total: number
}

type TQueryFnData = UseResult
type TError = any

/**
 *
 * @param options
 * @returns
 */
export default function useTeam(options?: UseQueryOptions<TQueryFnData, TError>) {
  const query = useQuery<TQueryFnData, TError>({
    queryKey: ["team"],
    queryFn: async () => {
      const result = await fetch("/api/team", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      return result.json()
    },
    ...options,
  })

  return {
    ...query,
    data: query.data?.data || [],
    total: query.data?.total || 0,
  }
}
