import { gql } from 'apollo-server-micro'

// const schema = require('../../schema.gql')
// import { SessionResolver } from './auth'
// import { ImageResolver } from './image'
import profile from './profile'
// import { authChecker } from './auth'
import { GraphQlDateTime } from './datetime'

const ABOUT = 'Boat Daddy API 1.0'

export const typeDefs = gql`
  """
  The javascript 'Date' as string. Type represents date and time as the ISO Date string.
  """
  scalar DateTime

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

  type Query {
    about: String!
    foo: String!
    profile(username: String!): Profile
  }

  type Mutation {
    createImageSignature: ImageSignature!
  }
`

export const resolvers = {
  Query: {
    about: () => ABOUT,
    foo: () => 'foo',
    profile: profile.get,
  },
  DateTime: GraphQlDateTime,
}
