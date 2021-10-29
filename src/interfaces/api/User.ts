import { User as UserType } from '../user'

export type User_user = {
  __typename: 'User'
} & UserType

export interface User {
  user: User_user | null
}

interface UserVariablesUsername {
  username: string
}

interface UserVariablesId {
  id: number
}

export type UserVariables = UserVariablesUsername | UserVariablesId
