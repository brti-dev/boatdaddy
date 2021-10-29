import { gql } from 'apollo-server-micro'

// const schema = require('../../schema.gql')
// import { SessionResolver } from './auth'
// import { ImageResolver } from './image'
import { getSession } from 'src/auth'
import user from './user'
// import { authChecker } from './auth'
import { GraphQlDateTime } from './datetime'
import { Context } from 'src/interfaces/api/context'

const ABOUT = 'Boat Daddy API 1.0'

export const typeDefs = gql`
  """
  The javascript 'Date' as string. Type represents date and time as the ISO Date string.
  """
  scalar DateTime

  enum Role {
    RIDER
    DRIVER
    ADMIN
  }

  enum Provider {
    PASSWORD
    GOOGLE
    MOCK
  }

  type ImageSignature {
    signature: String!
    timestamp: Int!
  }

  type Profile {
    aboutBoat: String
    bio: String
    birthday: DateTime!
    boatImage: String
    createdAt: DateTime!
    hasBoat: Boolean!
    id: Int!
    image: String
    isDaddy: Boolean!
    name: String!
    updatedAt: DateTime!
    userId: Int!
    username: String!
  }

  type Session {
    provider: Provider!
    userId: Int!
    username: String!
    roles: [Role]
  }

  type User {
    id: Int!
    username: String!
    email: String!
    emailVerified: DateTime
    image: String
    createdAt: DateTime
    updatedAt: DateTime
    profile: Profile
  }

  type Query {
    about: String!
    auth: Session
    user(username: String, id: Int): User
  }

  type Mutation {
    createImageSignature: ImageSignature!
  }
`

export const resolvers = {
  Query: {
    about: () => ABOUT,
    auth: (_, __, ctx: Context) => ctx.session,
    user: user.get,
  },
  DateTime: GraphQlDateTime,
}
