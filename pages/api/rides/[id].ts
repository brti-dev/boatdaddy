import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req
  const id = Number(query?.id) || -1

  switch (req.method) {
    case 'GET':
      const ride = await prisma.ride.findUnique({
        where: { id },
      })

      if (ride) {
        res.status(200).json(ride)
      } else {
        res.status(404).json({
          message: `The requested resource (ride id ${id}) could not be found`,
        })
      }
      break

    case 'POST':
      // Update ride

      break

    default:
      res.status(405).json({
        message: `The requested method ${req.method} is not supported`,
      })
  }
}
