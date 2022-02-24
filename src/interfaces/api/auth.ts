import { Session, Provider, Role } from 'interfaces/user'

export interface Auth {
  provider: Provider
  userId: number
  username: string
  roles: Role[] | []
}

export interface Auth_data {
  auth: Auth | null
}
