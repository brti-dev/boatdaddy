import 'reflect-metadata'
import { NextApiRequest, NextApiResponse } from 'next'
import { ApolloServer, gql } from 'apollo-server-micro'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'

import { prisma } from 'api/prisma'
import { Context } from 'interfaces/api/context'
import { typeDefs, resolvers } from 'api/graphql'
import { getSession } from 'lib/auth'

console.log('gql', typeDefs, resolvers)

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  // tracing: process.env.NODE_ENV === 'development',

  // Globally-available variables
  context: ({ req }: { req: NextApiRequest }): Context => {
    const session = getSession(req)
    console.log('Session for gql context', session)

    return {
      session,
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
