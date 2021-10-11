type Role = 'DRIVER' | 'RIDER' | 'ADMIN'

export type Identity = {
  name?: string
  username?: string
  birthday?: string
  isDaddy?: Boolean
  hasBoat?: Boolean
  createdAt?: string
  updatedAt?: string
  bio?: string
  aboutBoat?: string
  boatImage?: string
}

export type User = {
  id?: number | null
  name?: string | null
  email?: string | null
  image?: string | null
  roles?: Role[] | null
  identity?: Identity
}

export type Session = {
  user?: User
  expires?: string
}
