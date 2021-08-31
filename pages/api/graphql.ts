import 'reflect-metadata'
import { NextApiRequest, NextApiResponse } from 'next'
import { ApolloServer, gql } from 'apollo-server-micro'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { getSession } from 'next-auth/client'

import { prisma } from 'src/prisma'
import { Context } from 'src/graphql/context'
import { Session } from 'src/session'
import { schema } from 'src/graphql'

const apolloServer = new ApolloServer({
  schema,
  // tracing: process.env.NODE_ENV === 'development',
  // Globally-available variables
  context: async ({ req }: { req: NextApiRequest }): Promise<Context> => {
    const session_ = await getSession({ req })
    const session: Session = session_
    console.log('session for gql context', session)

    return {
      uid: session?.user?.id,
      prisma,
    }
  },
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground({
      settings: { 'request.credentials': 'include' },
    }),
  ],
})

const startServer = apolloServer.start()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://studio.apollographql.com'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }

  await startServer
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res)
}

export const config = {
  api: {
    bodyParser: false,
  },
}
