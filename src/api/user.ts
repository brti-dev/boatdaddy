/**
 * Common backend CRUD operations for users.
 * Abstracted for auth API and GraphQL.
 */
import { User } from 'src/interfaces/user'
import { UserVariables, User_data, UserAddInput } from 'src/interfaces/api/User'
import { prisma } from 'src/prisma'

async function get(variables: UserVariables): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: variables,
    include: { profile: true },
  })

  if (!user || Object.keys(user).length === 0) {
    return null
  }

  return user
}

async function add(input: UserAddInput): Promise<User> {
  const roles = [{ role: 'RIDER' }]
  if (input.profile.hasBoat) {
    roles.push({ role: 'DRIVER' })
  }

  const putOperation = {
    data: {
      ...input,
    },
  }

  const createResult = await prisma.user.create(putOperation)

  console.log('user add', createResult)

  return createResult
}

export default { get, add }
