"use client"

import { useQuery, UseQueryOptions } from "@tanstack/react-query"

interface UseResult {
  data: any[]
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
export default function useDashboard(options?: UseQueryOptions<TQueryFnData, TError>) {
  const query = useQuery<TQueryFnData, TError>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const result = await fetch(`/api/dashboard`, {
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
