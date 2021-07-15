import { NextApiHandler } from 'next'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import Adapters from 'next-auth/adapters'
import prisma from '@/lib/prisma'

const options = {
  providers: [
    Providers.Facebook({
      clientId: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
    }),
  ],
  adapter: Adapters.Prisma.Adapter({ prisma }),
  secret: process.env.SECRET,
}

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options)
export default authHandler
