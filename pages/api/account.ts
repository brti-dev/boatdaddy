import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import prisma from '@/lib/prisma'
import { Session } from '@/lib/session'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session_ = await getSession({ req })
  const session: Session = session_

  const operation = {
    data: {
      name: req.body.name,
      username: req.body.username,
      birthday: new Date(req.body.birthday),
      isDaddy: req.body.isDaddy === 'true',
      hasBoat: req.body.hasBoat === 'true',
      //     createdAt DateTime @default(now()) @map(name: "created_at")
      // updatedAt DateTime @updatedAt @map(name: "updated_at")
      // userId: session.user.id,
      User: { connect: { id: session.user.id } },
    },
  }

  switch (req.method) {
    case 'PUT':
      const putResult = await prisma.identity.create(operation)
      res.json(putResult)

      break

    case 'POST':
      operation.where = { user: { id: session.user.id } }
      const postResult = await prisma.identity.update(operation)
      res.json(postResult)
      break

    default:
      res.status(405).json({
        message: `The requested method ${req.method} is not supported`,
      })
  }
}
