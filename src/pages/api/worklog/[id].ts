import _ from "lodash"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import prisma from "~/lib/prisma"
import { authOptions } from "../auth/[...nextauth]"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { project_id, user_id, remaining_time, worked_at, duration, description, is_billable } =
    req.body

  const session = await getServerSession(req, res, authOptions)
  const newAuthorId = _.get(session, "user.id", user_id)

  if (_.isEmpty(session)) {
    res.status(401).send({ message: "Unauthorized" })
  }

  if (!["GET", "PUT", "DELETE"].includes(String(req.method).toUpperCase())) {
    res.status(405).send({ message: "Method not allowed" })
  }

  // find by id project
  if (req.method === "GET") {
    const result = await prisma.worklog.findFirst({
      where: { id: String(req.query.id) },
    })

    if (!result) {
      res.status(404).send({ message: "Team not found" })
    }

    res.json({ data: result })
  }

  // update user project
  if (req.method === "PUT") {
    console.log("PUT", req.query.id)

    const result = await prisma.worklog.update({
      where: { id: String(req.query.id) },
      data: {
        project_id: project_id,
        user_id: newAuthorId,
        remaining_time: remaining_time,
        worked_at: worked_at,
        duration: duration,
        description: description,
        is_billable: is_billable,
      },
    })
    res.json(result)
  }

  // delete user project
  if (req.method === "DELETE") {
    console.log("DELETE", req.query.id)

    const result = await prisma.worklog.delete({
      where: { id: String(req.query.id) },
    })
    res.json(result)
  }
}
