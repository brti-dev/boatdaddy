import { PrismaClient } from '@prisma/client'

type User = {
  id: number
}

export interface Context {
  user: User | null
  prisma: PrismaClient
}

export interface AuthorizedContext extends Context {
  user: User
}
