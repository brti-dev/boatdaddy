import { User as UserType } from '../user'

export type User = {
  __typename: 'User'
} & UserType

export interface User_data {
  user: User | null
}

export type UserVariables = {
  username?: string
  id?: number
}
