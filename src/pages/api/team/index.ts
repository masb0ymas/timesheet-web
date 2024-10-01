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
  const { project_id, owner_id, remaining_time } = req.body

  const session = await getServerSession(req, res, authOptions)
  const newOwnerId = _.get(session, "user.id", owner_id)

  if (_.isEmpty(session)) {
    res.status(401).send({ message: "Unauthorized" })
  }

  if (!["GET", "POST"].includes(String(req.method).toUpperCase())) {
    res.status(405).send({ message: "Method not allowed" })
  }

  // find all user project
  if (req.method === "GET") {
    const result = await prisma.userProject.findMany({
      take: 10,
      include: { user: true, project: true },
    })
    const total = await prisma.userProject.count()

    res.json({ data: result, total })
  }

  // create user project
  if (req.method === "POST") {
    const result = await prisma.userProject.create({
      data: {
        user_id: newOwnerId,
        project_id: project_id,
        remaining_time: remaining_time,
      },
    })
    res.json(result)
  }
}
