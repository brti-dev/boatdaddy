export type Role = 'DRIVER' | 'RIDER' | 'ADMIN'

export type Roles = Role[]

export type Provider = 'GOOGLE' | 'MOCK' | 'PASSWORD'

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

export type Session = {
  provider: Provider
  userId: number
  username: string
  roles: Roles | null
}
