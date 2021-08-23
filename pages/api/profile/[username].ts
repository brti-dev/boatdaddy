import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req
  const username = query?.username as string

  if (!username) {
    res.status(404).json({
      message: `The requested resource could not be found`,
    })

    return
  }

  const user = await prisma.identity.findUnique({
    where: { username },
    include: { User: { select: { image: true } } },
  })

  if (!user || Object.keys(user).length === 0) {
    res.status(404).json({
      message: `The requested resource (username '${username}') could not be found`,
    })

    return
  }

  const profile = { ...user, image: user.User?.image }
  delete profile.User

  res.json(profile)
}
