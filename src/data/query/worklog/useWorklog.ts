"use client"

import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import qs from "qs"
import { WorklogEntity } from "~/data/entity/worklog"

interface UseResult {
  data: WorklogEntity[]
  total: number
}

type TQueryFnData = UseResult
type TError = any

interface QueryOptions {
  [key: string]: any
}

/**
 *
 * @param options
 * @returns
 */
export default function useWorklog(
  queryOptions?: QueryOptions,
  options?: UseQueryOptions<TQueryFnData, TError>
) {
  const query = useQuery<TQueryFnData, TError>({
    queryKey: ["worklog"],
    queryFn: async () => {
      const result = await fetch(`/api/worklog?${qs.stringify(queryOptions)}`, {
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
