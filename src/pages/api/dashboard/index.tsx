import { endOfMonth, startOfMonth } from "date-fns"
import _ from "lodash"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { groupBy } from "~/lib/array"
import prisma from "~/lib/prisma"
import { authOptions } from "../auth/[...nextauth]"
import { WorklogEntity } from "~/data/entity/worklog"

interface WorklogGroup {
  worked_at: string
  spend_time: number
  project_completed: number
  remaining_time: number
  data: WorklogEntity[]
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const user_id = _.get(session, "user.id") as string

  if (_.isEmpty(session)) {
    res.status(401).send({ message: "Unauthorized" })
  }

  if (!["GET"].includes(String(req.method).toUpperCase())) {
    res.status(405).send({ message: "Method not allowed" })
  }

  const getMemberCount = await prisma.userProject.count({
    where: { user_id },
  })

  const getWorklog = await prisma.worklog.findMany({
    where: {
      user_id,
      worked_at: {
        gte: startOfMonth(new Date()),
        lte: endOfMonth(new Date()),
      },
    },
  })

  const worklogGroup: WorklogGroup[] = []

  if (!_.isEmpty(getWorklog)) {
    const groupWorklog = groupBy(getWorklog, "worked_at")

    for (let i = 0; i < groupWorklog.length; i += 1) {
      const item = groupWorklog[i]

      const spend_time = item.data.reduce((acc: any, curValue: any) => {
        const duration = curValue.duration.replace("h", "")
        acc += Number(duration)
        return acc
      }, 0)

      let project_completed = 0
      let remaining_time = 0

      if (spend_time >= 8) {
        project_completed += 1
      } else {
        remaining_time = 8 - spend_time
      }

      // @ts-expect-error
      worklogGroup.push({
        ...item,
        spend_time,
        project_completed,
        remaining_time,
      })
    }
  }

  const calculateTotal = (key: keyof WorklogGroup): number =>
    worklogGroup.reduce((acc, curr) => acc + Number(curr[key]), 0)

  const total_project = calculateTotal("project_completed")
  const total_spend_time = calculateTotal("spend_time")
  const total_remaining_time = calculateTotal("remaining_time")

  const data = [
    {
      name: "Project",
      value: total_project,
      limit: 0,
    },
    {
      name: "Spend Time",
      value: total_spend_time,
      limit: 160,
    },
    {
      name: "Remaining Time",
      value: total_remaining_time,
      limit: 0,
    },
    {
      name: "Member Project",
      value: getMemberCount,
      limit: 0,
    },
  ]

  const result = {
    worklogs: worklogGroup,
    data,
  }

  res.json(result)
}
