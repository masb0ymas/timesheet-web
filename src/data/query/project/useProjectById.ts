"use client"

import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { ProjectEntity } from "~/data/entity/project"

type UseResult = ProjectEntity

type TQueryFnData = UseResult
type TError = any

/**
 *
 * @param options
 * @returns
 */
export default function useProjectById(
  id: string,
  options?: UseQueryOptions<TQueryFnData, TError>
) {
  const query = useQuery<TQueryFnData, TError>({
    queryKey: ["project-by-id", id],
    queryFn: async () => {
      const result = await fetch(`/api/project/${id}`, {
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
