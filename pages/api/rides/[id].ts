import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handle(
  { query }: NextApiRequest,
  res: NextApiResponse
) {
  const id = Number(query?.id) || -1
  const ride = await prisma.ride.findUnique({
    where: { id },
  })

  if (ride) {
    res.status(200).json(ride)
  } else {
    res
      .status(404)
      .json({
        message: `The requested resource (ride id ${id}) could not be found`,
      })
  }
}
