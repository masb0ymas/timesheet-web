import prisma from "~/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { name, description } = req.body

  // const session = await getServerSession(req, res, options)
  // if (session) {
  // @ts-expect-error
  const result = await prisma.post.create({
    data: {
      name: name,
      description: description,
      // author: { connect: { email: session?.user?.email } },
    },
  })
  res.json(result)
  // } else {
  //   res.status(401).send({ message: "Unauthorized" })
  // }
}
