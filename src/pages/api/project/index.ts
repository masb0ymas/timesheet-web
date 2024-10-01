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
  const { name, description, owner_id } = req.body

  const session = await getServerSession(req, res, authOptions)
  const newOwnerId = _.get(session, "user.id", owner_id)

  if (_.isEmpty(session)) {
    res.status(401).send({ message: "Unauthorized" })
  }

  if (!["GET", "POST"].includes(String(req.method).toUpperCase())) {
    res.status(405).send({ message: "Method not allowed" })
  }

  // find all project
  if (req.method === "GET") {
    const { is_member } = req.query
    const skip = _.get(req.query, "skip", "0")
    const take = _.get(req.query, "take", "10")

    let conditions: any = {}

    if (is_member) {
      const result = await prisma.userProject.findMany({
        where: {
          user_id: newOwnerId,
        },
      })
      const collect_project_ids = _.map(result, "project_id")
      const unique_project_ids = _.uniq(collect_project_ids)

      conditions = {
        ...conditions,
        id: {
          in: unique_project_ids,
        },
      }
    }

    const result = await prisma.project.findMany({
      skip: Number(skip),
      take: Number(take),
      where: conditions,
    })
    const total = await prisma.project.count({ where: conditions })

    res.json({ data: result, total })
  }

  // create project
  if (req.method === "POST") {
    const result = await prisma.project.create({
      data: {
        name: name,
        description: description,
        owner_id: newOwnerId,
      },
    })
    res.json(result)
  }
}
