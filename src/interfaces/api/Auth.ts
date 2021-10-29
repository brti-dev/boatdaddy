import { Session, Provider, Role } from 'src/interfaces/user'

export interface Auth_auth {
  provider: Provider
  userId: number
  username: string
  roles: Role[] | []
}

export interface Auth {
  auth: Auth_auth | null
}
