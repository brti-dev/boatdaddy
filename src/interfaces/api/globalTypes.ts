import { Roles } from 'src/interfaces/user'

export type Identity = {
  name?: string
  username?: string
  birthday?: string
  isDaddy?: boolean
  hasBoat?: boolean
  createdAt?: string
  updatedAt?: string
  bio?: string
  aboutBoat?: string
  boatImage?: string
}

export type User = {
  id: number | null
  name: string | null
  email: string | null
  image?: string | null
  roles?: Roles | null
  identity?: Identity
}
