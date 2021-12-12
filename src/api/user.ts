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
} from 'src/interfaces/api/user'
import { DeleteResult } from 'src/interfaces/api/globalTypes'
import { USERNAME_TESTS, EMAIL_TEST } from 'src/user'
import { prisma } from 'src/prisma'

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

function verify(input: UserUpdateInput, strict?: boolean): UserUpdateInput
function verify(input: UserAddInput, strict?: boolean): UserAddInput {
  if (strict) {
    if (!input.profile?.name) {
      throw new Error('Profile name is required')
    }

    const name = input.profile.name.trim()
    if (name === '' || name.length < 2) {
      throw new Error('Please input a name that is at least two characters')
    }
  }

  input.username &&
    USERNAME_TESTS.map(({ test, message }) => {
      if (!test(input.username)) {
        throw new Error(message)
      }
    })

  if (input.email && !EMAIL_TEST.test(input.email)) {
    throw new Error('Please input a valid email address')
  }

  if (input.emailVerified === true) {
    input.emailVerified = new Date()
  }

  return input
}

function attachRoles(userData): User {
  const user = { ...userData, roles: [] }
  if (user.actor?.length) {
    user.roles = user.actor.map(act => act.role)
  }
  delete user.actor

  return user
}

async function get(variables: UserVariables): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: variables,
    include: { profile: true, actor: true },
  })

  console.log('user get', user)

  if (!user || Object.keys(user).length === 0) {
    return null
    //`The requested resource (username '${username}') could not be found`,
  }

  const userWithRoles = attachRoles(user)

  return userWithRoles
}

async function getAll(): Promise<User[]> {
  const users = await prisma.user.findMany({
    include: { profile: true, actor: true },
  })

  return users.map(user => attachRoles(user))
}

async function add(input: UserAddInput): Promise<User> {
  console.log('add user', input)
  if (!input.username) {
    input.username = await makeUsername(input)
  }

  const newUser = verify(input, true)

  if (!newUser.profile.isBoatDaddy) {
    newUser.profile.isBoatDaddy = false
  }

  const roles: Roles = ['RIDER']
  if (newUser.profile.isBoatDaddy) {
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

  const savedUser = await get({ id: addResult.id })

  return savedUser
}

async function doAdd(createOperation) {
  return await prisma.user.create(createOperation)
}

async function update(id: number, input: UserUpdateInput): Promise<User> {
  try {
    console.log('update user', id, input)
    const userData = verify(input)

    let roles: Roles = []
    const allActor = await prisma.actor.findMany({
      where: { userId: id },
    })
    if (userData.profile?.isBoatDaddy) {
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

    const { profile, ...data } = userData
    const userUpdate = {
      data,
      where: { id },
    }
    const updateResult = await prisma.user.update(userUpdate)

    console.log('update user result', updateResult)

    if (profile) {
      const profileUpdate = {
        data: { ...profile },
        where: { userId: id },
      }
      const updateProfileResult = await prisma.profile.update(profileUpdate)

      console.log('update profile result:', updateProfileResult)
    }

    const updatedUser = get({ id })

    return updatedUser
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

export default { get, getAll, add, update, delete: remove, attachRoles }
