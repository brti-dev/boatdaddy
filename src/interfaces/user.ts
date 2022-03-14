export type Role = 'DRIVER' | 'RIDER' | 'ADMIN'

export type Roles = Role[]

export type Provider = 'GOOGLE' | 'MOCK' | 'PASSWORD'

export interface Profile {
  aboutBoat: string
  bio: string
  birthday: any
  boatImage: string
  boatName: string
  createdAt: any
  isBoatDaddy: boolean
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
  profile?: Partial<Profile>
  longitude: number
  latitude: number
}

export type Session = {
  provider: Provider
  userId: number
  username: string
  roles: Roles
}
