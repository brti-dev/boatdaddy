import { User as UserType, Roles } from '../user'

export interface NearbyDrivers_variables {
  longitude?: number
  latitude?: number
  within?: number
  bounds?: string
}

export interface NearbyDrivers_data {
  nearbyDrivers: User[]
}

export type User = UserType

export interface User_data {
  user: User | null
}

export type UserVariables = {
  username?: string
  id?: number
  email?: string
}

export interface UserAddInput {
  username?: string
  email: string
  emailVerified?: any
  image?: string
  roles?: Roles
  profile: ProfileAddInput
}

export interface UserDeleteInput_input {
  id: number
}

export interface UserList {
  users: User[]
  pages: number
}

export interface UserList_data {
  userList: UserList
}

export interface UserListVariables {
  isBoatDaddy?: boolean
}

export interface UserUpdateInput {
  username?: string
  email?: string
  emailVerified?: any
  image?: string
  roles?: Roles
  profile?: ProfileUpdateInput
  latitude?: number
  longitude?: number
}

export interface UserUpdateInput_input {
  id: number
  input: UserUpdateInput
}

export interface ProfileAddInput {
  aboutBoat?: string
  bio?: string
  birthday?: any
  boatImage?: string
  boatName?: string
  isBoatDaddy: boolean
  name: string
}

export interface ProfileUpdateInput {
  aboutBoat?: string
  bio?: string
  birthday?: any
  boatImage?: string
  boatName?: string
  isBoatDaddy?: boolean
  name?: string
}
