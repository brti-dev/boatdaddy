import { gql } from 'apollo-server-micro'

// import { ImageResolver } from './image'
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

  type DeleteResult {
    success: Boolean!
    numberDeleted: Int!
    message: String
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

  input ProfileInput {
    aboutBoat: String
    bio: String
    birthday: DateTime
    boatImage: String
    hasBoat: Boolean
    image: String
    isDaddy: Boolean
    name: String
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
    roles: [Role]!
  }

  input UserInput {
    "Must be a valid email address"
    email: String
    "When the email was verified"
    emailVerified: DateTime
    "The location of a profile image for avatar"
    image: String
    "Full name"
    name: String
    "A user handle; Username must: begin with a letter, be at least three characters long, be 25 characters or less, not contain any space characters"
    username: String
    profile: ProfileInput
    roles: [Role]
  }

  type Query {
    about: String!
    auth: Session
    user(username: String, id: Int, email: String): User
  }

  type Mutation {
    createImageSignature: ImageSignature!
    userAdd(input: UserInput): User!
    userUpdate(input: UserInput): User!
    userDelete(id: Int): DeleteResult!
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
