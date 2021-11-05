import { User as UserType, Roles } from '../user'

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
  roles: Roles
  profile: ProfileAddInput
}

export interface UserUpdateInput {
  username?: string
  email?: string
  emailVerified?: any
  image?: string
  roles?: Roles
  profile?: ProfileUpdateInput
}

export interface ProfileAddInput {
  aboutBoat?: string
  bio?: string
  birthday?: any
  boatImage?: string
  hasBoat: boolean
  isDaddy: boolean
  name: string
}

export interface ProfileUpdateInput {
  aboutBoat?: string
  bio?: string
  birthday?: any
  boatImage?: string
  hasBoat?: boolean
  isDaddy?: boolean
  name?: string
}
