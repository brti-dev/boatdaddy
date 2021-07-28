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
  const { name, username, birthday, isDaddy, hasBoat } = JSON.parse(req.body)

  const data = {
    name,
    username,
    birthday: new Date(birthday),
    isDaddy: !!isDaddy,
    hasBoat: !!hasBoat,
    //     createdAt DateTime @default(now()) @map(name: "created_at")
    // updatedAt DateTime @updatedAt @map(name: "updated_at")
    // userId: session.user.id,
  }

  // res.status(200).json({ reqBody: req.body, reqOperation: operation })

  switch (req.method) {
    case 'PUT':
      const putOperation = {
        data: {
          ...data,
          User: { connect: { id: session.user.id } },
        },
      }
      const putResult = await prisma.identity.create(putOperation)

      res.json(putResult)

      break

    case 'POST':
      const postOperation = {
        data,
        where: { userId: session.user.id },
      }
      const postResult = await prisma.identity.update(postOperation)

      res.json(postResult)

      break

    default:
      res.status(405).json({
        message: `The requested method ${req.method} is not supported`,
      })
  }
}
