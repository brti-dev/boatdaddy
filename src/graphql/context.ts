import { PrismaClient } from '@prisma/client'

type User = {
  id: number
  username: string
}

export interface Context {
  user: User | null
  prisma: PrismaClient
}

export interface AuthorizedContext extends Context {
  user: User
}
