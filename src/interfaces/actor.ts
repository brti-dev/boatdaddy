import { User, Role } from './user'
import { Ride } from './ride'

export interface Actor {
  id: number
  role: Role
  isActive: Boolean
  userId: number
  user: User
}
