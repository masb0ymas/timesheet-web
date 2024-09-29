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

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions)
export default authHandler


export const authOptions: NextAuthOptions = {
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
            fullname: true,
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

        return { id: getUser.id, fullname: getUser.fullname, email: getUser.email }
      },
    }),
  ],
  callbacks: {
    jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token
        token.id = user?.id
      }
      return token
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user = {
          ...session.user,
          id: token.id,
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
}
