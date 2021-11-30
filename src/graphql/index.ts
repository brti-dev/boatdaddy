import { gql } from 'apollo-server-micro'

import image from './image'
import user from './user'
import ride from './ride'
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

  type Actor {
    id: Int!
    role: Role!
    isActive: Boolean!
    userId: Int!
    user: User!
    ridesAsRider: [Ride]!
    ridesAsDriver: [Ride]!
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
    birthday: DateTime
    boatImage: String
    createdAt: DateTime!
    id: Int!
    image: String
    isBoatDaddy: Boolean!
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
    image: String
    isBoatDaddy: Boolean
    name: String
  }

  type Ride {
    id: Int!
    startedAt: DateTime!
    finishedAt: DateTime
    driver: Actor!
    rider: Actor!
  }

  input RideAddInput {
    "User ID of the driver"
    driverId: Int!
    "User ID of the rider"
    riderId: Int!
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

  input UserAddInput {
    "Must be a valid email address"
    email: String!
    "The location of a profile image for avatar"
    image: String
    "Full name"
    name: String!
    "A user handle; Username must: begin with a letter, be at least three characters long, be 25 characters or less, not contain any space characters"
    username: String!
  }

  input UserUpdateInput {
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
    allUsers: [User!]!
    auth: Session
    ride(id: Int): Ride
    user(username: String, id: Int, email: String): User
  }

  type Mutation {
    createImageSignature: ImageSignature!
    rideAdd(input: RideAddInput): Ride!
    userAdd(input: UserAddInput): User!
    userDelete(id: Int): DeleteResult!
    userDbSeed: DeleteResult!
    userUpdate(id: Int!, input: UserUpdateInput!): User!
  }
`

export const resolvers = {
  Query: {
    about: () => ABOUT,
    allUsers: user.getAll,
    auth: (_, __, ctx: Context) => ctx.session,
    ride: ride.get,
    rideList: ride.list,
    user: user.get,
  },
  Mutation: {
    createImageSignature: image.createImageSignature,
    rideAdd: ride.add,
    rideUpdate: ride.update,
    userAdd: user.add,
    userDbSeed: user.seed,
    userDelete: user.delete,
    userUpdate: user.update,
  },
  DateTime: GraphQlDateTime,
}
