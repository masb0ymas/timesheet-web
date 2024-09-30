import _ from "lodash"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import prisma from "~/lib/prisma"
import { authOptions } from "../auth/[...nextauth]"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { name, description, owner_id } = req.body

  const session = await getServerSession(req, res, authOptions)
  const newOwnerId = _.get(session, "user.id", owner_id)

  if (_.isEmpty(session)) {
    res.status(401).send({ message: "Unauthorized" })
  }

  if (!["GET", "PUT", "DELETE"].includes(String(req.method).toUpperCase())) {
    res.status(405).send({ message: "Method not allowed" })
  }

  // find by id project
  if (req.method === "GET") {
    const result = await prisma.project.findFirst({
      where: { id: String(req.query.id) },
    })

    if (!result) {
      res.status(404).send({ message: "Project not found" })
    }

    res.json({ data: result })
  }

  // update project
  if (req.method === "PUT") {
    console.log("PUT", req.query.id)

    const result = await prisma.project.update({
      where: { id: String(req.query.id) },
      data: {
        name: name,
        description: description,
        owner_id: newOwnerId,
      },
    })
    res.json(result)
  }

  // delete project
  if (req.method === "DELETE") {
    console.log("DELETE", req.query.id)

    const result = await prisma.project.delete({
      where: { id: String(req.query.id) },
    })
    res.json(result)
  }
}
