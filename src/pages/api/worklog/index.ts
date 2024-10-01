import _ from "lodash"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import prisma from "~/lib/prisma"
import { authOptions } from "../auth/[...nextauth]"

/**
 *
 * @param req
 * @param res
 */
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { project_id, user_id, remaining_time, worked_at, duration, description, is_billable } =
    req.body

  const session = await getServerSession(req, res, authOptions)
  const newAuthorId = _.get(session, "user.id", user_id)

  if (_.isEmpty(session)) {
    res.status(401).send({ message: "Unauthorized" })
  }

  if (!["GET", "POST"].includes(String(req.method).toUpperCase())) {
    res.status(405).send({ message: "Method not allowed" })
  }

  // find all user project
  if (req.method === "GET") {
    const result = await prisma.worklog.findMany({
      take: 10,
      include: { user: true, project: true },
    })
    const total = await prisma.worklog.count()

    res.json({ data: result, total })
  }

  // create user project
  if (req.method === "POST") {
    const result = await prisma.worklog.create({
      data: {
        user_id: newAuthorId,
        project_id: project_id,
        remaining_time: remaining_time,
        worked_at: worked_at,
        duration: duration,
        description: description,
        is_billable: is_billable,
      },
    })
    res.json(result)
  }
}
