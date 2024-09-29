import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextApiHandler } from "next"
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { verify } from "~/lib/hash"
import prisma from "~/lib/prisma"

interface Credentials {
  email: string
  password: string
}

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options)
export default authHandler

export const options: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as Credentials

        // logic to check credentials
        const getUser = await prisma.user.findFirst({
          where: { email },
          select: {
            id: true,
            email: true,
            password: true,
          },
        })

        if (!getUser) {
          throw new Error("Invalid credentials, user not found")
        }

        const isMatch = await verify(password, getUser.password)
        console.log(getUser, isMatch)

        if (!isMatch) {
          throw new Error("Invalid credentials, email or password is incorrect")
        }

        return { id: getUser.id, email: getUser.email }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
}
