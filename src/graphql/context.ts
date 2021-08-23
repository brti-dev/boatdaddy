import { PrismaClient } from '@prisma/client'

export interface Context {
  uid: number | null
  prisma: PrismaClient
}

export interface AuthorizedContext extends Context {
  uid: number
}
