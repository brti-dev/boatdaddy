import { Context } from 'src/interfaces/api/context'
import { User, UserVariables } from 'src/interfaces/api/User'

const get = async (_, vars: UserVariables, ctx: Context): Promise<User> => {
  const { id, username } = vars

  const birthday = new Date('1980-01-01')

  return {
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
      birthday,
      boatImage: null,
      hasBoat: true,
      image: null,
      isDaddy: true,
      createdAt: new Date(2021, 6, 1),
      updatedAt: new Date(2021, 6, 1),
      userId: 1,
    },
    roles: ['RIDER', 'DRIVER', 'ADMIN'],
  }
  // const user = await ctx.prisma.user.findUnique({
  //   where: { username },
  //   include: { profile: true },
  // })

  // if (!user || Object.keys(user).length === 0) {
  //   return null
  //   //`The requested resource (username '${username}') could not be found`,
  // }

  // console.log('user result', user)

  // return user

  // const profile_ = { ...user, image: user.User?.image }
  // delete profile_.User

  // return profile_
}

export default { get }
