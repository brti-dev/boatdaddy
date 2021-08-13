import PrismaClient from '@/lib/prisma'

export interface Context {
  uid: number | null
  prisma: any //PrismaClient
}

export interface AuthorizedContext extends Context {
  uid: number
}
