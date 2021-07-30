import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { Session } from '@/lib/session'
import prisma from '@/lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      const session_ = await getSession({ req })
      const session: Session = session_
      
      const rides = await prisma.ride.findMany()

      res.json(rides)

      break

    case 'PUT':
      const { driverId, riderId } = req.body
      const ride = await prisma.ride.create({
        data: {
          startedAt: new Date(),
          //     createdAt DateTime @default(now()) @map(name: "created_at")
          // updatedAt DateTime @updatedAt @map(name: "updated_at")
          // userId: session.user.id,
          driver: { connect: { id: driverId } },
          rider: { connect: { id: riderId } },
        },
      })

      res.json(ride)

      break

    default:
      res.status(405).json({
        message: `The requested method ${req.method} is not supported`,
      })
  }
}
