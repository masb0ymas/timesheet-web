"use client"

import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { WorklogEntity } from "~/data/entity/worklog"

type UseResult = WorklogEntity

type TQueryFnData = UseResult
type TError = any

/**
 *
 * @param options
 * @returns
 */
export default function useWorklogById(id: string, options?: UseQueryOptions<TQueryFnData, TError>) {
  const query = useQuery<TQueryFnData, TError>({
    queryKey: ["worklog-by-id", id],
    queryFn: async () => {
      const result = await fetch(`/api/worklog/${id}`, {
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
