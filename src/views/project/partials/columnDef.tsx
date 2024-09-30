"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { ProjectEntity } from "~/data/entity/project"

const columnHelper = createColumnHelper<ProjectEntity>()

export const projectColumn = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("description", {
    cell: (info) => {
      const short_description = info.getValue().substring(0, 100)
      return <span>{short_description}...</span>
    },
  }),
]
