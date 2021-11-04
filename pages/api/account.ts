import { NextApiRequest, NextApiResponse } from 'next'
// import { getSession } from 'next-auth/client'

// import { Session, USERNAME_TESTS } from 'src/session'
import { prisma } from 'src/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return
  const session_ = await getSession({ req })
  const session: Session = session_
  const {
    name: name_,
    username,
    birthday,
    isDaddy,
    hasBoat,
    bio,
    aboutBoat,
    boatImage,
  } = JSON.parse(req.body)

  const name = name_.trim()
  if (name === '' || name.length < 2) {
    res
      .status(400)
      .json({ message: 'Please input a name that is at least two characters' })
  }

  USERNAME_TESTS.map(({ test, message }) => {
    if (!test(username)) {
      res.status(400).json({ message })
    }
  })

  const data = {
    name,
    username,
    birthday: new Date(birthday),
    isDaddy: !!isDaddy,
    hasBoat: !!hasBoat,
    bio,
    aboutBoat,
    boatImage,
  }

  // res.status(200).json({ reqBody: req.body, reqOperation: operation })

  // Create account
  if (req.method === 'PUT') {
    const roles = [{ role: 'RIDER' }]
    if (data.hasBoat) roles.push({ role: 'DRIVER' })

    const putOperation = {
      data: {
        ...data,
        actor: { create: roles },
        User: { connect: { id: session.user.id } },
      },
    }
    const putResult = await prisma.identity.create(putOperation)

    res.json(putResult)

    return
  }

  // Update account
  if (req.method === 'POST') {
    const allActor = await prisma.actor.findMany({
      where: { userId: session.user.id },
    })

    let roles: string[] = []

    if (data.hasBoat) {
      const driverRole = allActor.filter(actor => actor.role === 'DRIVER')
      if (!driverRole) {
        roles.push('DRIVER')
      }
    }

    if (roles.length) {
      const actorResult = await prisma.actor.create({
        data: { role: 'DRIVER', userId: session.user.id },
      })
      console.log('Actor', actorResult)
    }

    const postOperation = {
      data,
      where: { userId: session.user.id },
    }
    const postResult = await prisma.identity.update(postOperation)

    res.json(postResult)

    return
  }

  res.status(405).json({
    message: `The requested method ${req.method} is not supported`,
  })
}
