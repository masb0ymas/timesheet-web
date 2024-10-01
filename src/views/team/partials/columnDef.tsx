"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { TeamEntity } from "~/data/entity/team"

const columnHelper = createColumnHelper<TeamEntity>()

export const teamColumn = [
  columnHelper.accessor("user.fullname", {
    header: "Fullname",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("project.name", {
    header: "Project",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("remaining_time", {
    header: "Remaining Time",
    cell: (info) => info.getValue(),
  }),
]
