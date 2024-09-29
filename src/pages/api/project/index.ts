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

  if (session) {
    const result = await prisma.project.create({
      data: {
        name: name,
        description: description,
        owner_id: newOwnerId,
      },
    })
    res.json(result)
  } else {
    res.status(401).send({ message: "Unauthorized" })
  }
}
