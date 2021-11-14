/**
 * Common backend CRUD operations for users.
 * Abstracted for auth API and GraphQL.
 */
import { User, Roles } from 'src/interfaces/user'
import {
  UserVariables,
  User_data,
  UserAddInput,
  UserUpdateInput,
} from 'src/interfaces/api/User'
import { DeleteResult } from 'src/interfaces/api/globalTypes'
import { USERNAME_TESTS, EMAIL_TEST } from 'src/user'
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
  if (!email || !email.includes('@')) {
    throw new Error(`Cannot make username from invalid email`)
  }

  const [usernameFromEmail, ...rest] = email.split('@')

  const exists = await get({ username: usernameFromEmail })
  if (!exists) {
    return usernameFromEmail
  }

  const randomNumber = String(Math.random() * 100)
  const usernameRandom = `user-${randomNumber.slice(0, 5)}`

  return usernameRandom
}

function verify(
  input: UserUpdateInput | UserAddInput
): UserUpdateInput | UserAddInput {
  const name = input.profile.name.trim()
  if (name === '' || name.length < 2) {
    throw new Error('Please input a name that is at least two characters')
  }

  USERNAME_TESTS.map(({ test, message }) => {
    if (!test(input.username)) {
      throw new Error(message)
    }
  })

  if (!EMAIL_TEST.test(input.email)) {
    throw new Error('Please input a valid email address')
  }

  return input
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
  console.log('add user', input)
  if (!input.username) {
    input.username = await makeUsername(input)
  }

  const newUser = verify(input)

  const roles: Roles = ['RIDER']
  if (newUser.profile.hasBoat) {
    roles.push('DRIVER')
  }
  const rolesCreate = roles.map(role => ({ role: role }))

  const { profile, ...userData } = newUser

  const createOperation = {
    data: {
      ...userData,
      profile: {
        create: { ...profile },
      },
      actor: {
        create: rolesCreate,
      },
    },
  }

  const addResult = await doAdd(createOperation)
  console.log('add user result', addResult)

  if (!addResult.id) {
    return null
  }

  const newUserFinal = { ...addResult, roles }

  return newUserFinal
}

async function doAdd(createOperation) {
  return await prisma.user.create(createOperation)
}

async function update(id: number, input: UserUpdateInput): Promise<User> {
  try {
    const data = verify(input)

    const allActor = await prisma.actor.findMany({
      where: { userId: id },
    })

    let roles: string[] = []

    if (data.profile.hasBoat) {
      const driverRole = allActor.filter(actor => actor.role === 'DRIVER')
      if (!driverRole) {
        roles.push('DRIVER')
      }
    }

    if (roles.length) {
      const actorResult = await prisma.actor.create({
        data: { role: 'DRIVER', userId: id },
      })
      console.log('Actor', actorResult)
    }

    const postOperation = {
      data,
      where: { id },
    }
    const updateResult = (await prisma.user.update(postOperation)) as User

    return updateResult
  } catch (error) {
    throw error
  }
}

async function remove(id: number): Promise<DeleteResult> {
  const deleteUser = await prisma.user.delete({
    where: { id },
  })

  console.log('Delete User result', deleteUser)

  return {
    success: false,
    numberDeleted: 0,
    message: `Delete user id #${id}...`,
  }
}

export default { get, add, update, delete: remove }
