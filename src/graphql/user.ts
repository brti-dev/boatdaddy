import { Context } from 'src/interfaces/api/context'
import { User, UserVariables } from 'src/interfaces/api/User'

const MOCK_USER = {
  __typename: 'User',
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

const get = async (
  _,
  vars: UserVariables,
  ctx: Context
): Promise<User | null> => {
  const userData = await ctx.prisma.user.findUnique({
    where: vars,
    include: { profile: true, actor: true },
  })

  if (!userData || Object.keys(userData).length === 0) {
    return null
    //`The requested resource (username '${username}') could not be found`,
  }

  const user = { ...userData, roles: [], __typename: 'User' }
  user.roles = user.actor.map(act => act.role)
  delete user.actor

  console.log('user get', user)

  return user
}

export default { get }
