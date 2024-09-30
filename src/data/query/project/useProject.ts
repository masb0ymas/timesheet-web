"use client"

import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { ProjectEntity } from "~/data/entity/project"

interface UseResult {
  data: ProjectEntity[]
  total: number
}

type TQueryFnData = UseResult
type TError = any

/**
 *
 * @param options
 * @returns
 */
export default function useProject(options?: UseQueryOptions<TQueryFnData, TError>) {
  const query = useQuery<TQueryFnData, TError>({
    queryKey: ["project"],
    queryFn: async () => {
      const result = await fetch("/api/project", {
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
