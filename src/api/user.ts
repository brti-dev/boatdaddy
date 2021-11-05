/**
 * Common backend CRUD operations for users.
 * Abstracted for auth API and GraphQL.
 */
import { User } from 'src/interfaces/user'
import { UserVariables, User_data, UserAddInput } from 'src/interfaces/api/User'
import { prisma } from 'src/prisma'

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
    hasBoat: true,
    isDaddy: true,
    createdAt: new Date(2021, 6, 1),
    updatedAt: new Date(2021, 6, 1),
    userId: 1,
  },
  roles: ['RIDER', 'DRIVER', 'ADMIN'],
}

async function makeUsername({ email }): Promise<string> {
  const [usernameFromEmail, ...rest] = email.split('@')

  const exists = await prisma.user.findUnique({
    where: { username: usernameFromEmail },
  })
  if (!exists) {
    return usernameFromEmail
  }

  const randomNumber = String(Math.random() * 100)
  const usernameRandom = `user-${randomNumber.slice(0, 5)}`

  return usernameRandom
}

async function get(variables: UserVariables): Promise<User | null> {
  const userData = await prisma.user.findUnique({
    where: variables,
    include: { profile: true, actor: true },
  })

  if (!userData || Object.keys(userData).length === 0) {
    return null
    //`The requested resource (username '${username}') could not be found`,
  }

  const user = { ...userData, roles: [] }
  user.roles = user.actor.map(act => act.role)
  delete user.actor

  console.log('user get', user)

  return user
}

async function add(input: UserAddInput): Promise<User> {
  if (!input.username) {
    input.username = await makeUsername(input)
  }
  const roles = [{ role: 'RIDER' }]
  if (input.profile.hasBoat) {
    roles.push({ role: 'DRIVER' })
  }

  const putOperation = {
    data: {
      ...input,
    },
  }

  const addResult = await doAdd(putOperation)

  console.log('user add', addResult)

  return addResult
}

async function doAdd(putOperation) {
  return await prisma.user.create(putOperation)
}

export default { get, add }
