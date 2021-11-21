/**
 * Functionality here is moved to API...
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const MOCK_USER = {
  id: 1,
  username: 'john_daddy',
  email: 'john_daddy@boatdaddy.app',
  createdAt: new Date(2021, 6, 1),
  updatedAt: new Date(2021, 6, 2),
  profile: {
    name: 'John Daddy',
    aboutBoat: 'Take a good long look at this mother fucking boat',
    bio: "Aw shit get your towels ready because it's about to go down",
    birthday: new Date('1980-01-01'),
    boatImage: null,
    isBoatDaddy: true,
    createdAt: new Date(2021, 6, 1),
    updatedAt: new Date(2021, 6, 1),
    userId: 1,
  },
  roles: ['RIDER', 'DRIVER', 'ADMIN'],
}

async function main() {
  const delActor = prisma.actor.deleteMany({})
  const delProfile = prisma.profile.deleteMany({})
  const delUser = prisma.user.deleteMany({})

  console.log(
    `Deleted records: ${delActor} actor; ${delProfile} profile; ${delUser} user`
  )

  const { profile, roles, ...userData } = MOCK_USER

  const johnDaddy = await prisma.user.upsert({
    where: { email: MOCK_USER.email },
    update: {},
    create: {
      ...userData,
      profile: {
        create: { ...profile },
      },
      actor: {
        create: [{ role: 'RIDER' }, { role: 'DRIVER' }, { role: 'ADMIN' }],
      },
    },
  })

  console.log({ johnDaddy })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
