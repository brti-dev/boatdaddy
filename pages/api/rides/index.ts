import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handle(_: NextApiRequest, res: NextApiResponse) {
  const rides = await prisma.ride.findMany()

  res.json(rides)
}
