export type Role = 'DRIVER' | 'RIDER' | 'ADMIN'

export type Roles = Role[]

export type Provider = 'GOOGLE' | 'MOCK' | 'PASSWORD'

export interface Profile {
  aboutBoat: string | null
  bio: string | null
  birthday: any
  boatImage: string | null
  createdAt: any
  hasBoat: boolean
  isDaddy: boolean
  name: string
  updatedAt: any
  userId: number
}

export type User = {
  id: number
  username: string
  email: string
  emailVerified?: any
  image?: string
  roles: Roles
  createdAt: any
  updatedAt: any
  profile?: Profile
}

export type Session = {
  provider: Provider
  userId: number
  username: string
  roles: Roles
}
