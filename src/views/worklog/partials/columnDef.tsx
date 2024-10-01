"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { formatDate } from "date-fns"
import { WorklogEntity } from "~/data/entity/worklog"

const columnHelper = createColumnHelper<WorklogEntity>()

export const worklogColumn = [
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
  columnHelper.accessor("worked_at", {
    header: "Worked At",
    cell: (info) => {
      return <span>{formatDate(info.getValue(), "dd MMM yyyy")}</span>
    },
  }),
  columnHelper.accessor("duration", {
    header: "Duration",
    cell: (info) => info.getValue(),
  }),
]
