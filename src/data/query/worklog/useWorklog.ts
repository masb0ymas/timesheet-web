"use client"

import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { WorklogEntity } from "~/data/entity/worklog"

interface UseResult {
  data: WorklogEntity[]
  total: number
}

type TQueryFnData = UseResult
type TError = any

/**
 *
 * @param options
 * @returns
 */
export default function useWorklog(options?: UseQueryOptions<TQueryFnData, TError>) {
  const query = useQuery<TQueryFnData, TError>({
    queryKey: ["worklog"],
    queryFn: async () => {
      const result = await fetch("/api/worklog", {
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
