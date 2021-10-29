import { Context } from 'src/interfaces/api/context'
import { User, UserVariables } from 'src/interfaces/api/User'

const get = async (_, vars: UserVariables, ctx: Context): Promise<User> => {
  const { id, username } = vars

  const birthday = new Date('1980-01-01')

  return {
    __typename: 'User',
    id: 1,
    username,
    email: 'john_daddy@boatdaddy.app',
    createdAt: new Date(2021, 6, 1),
    updatedAt: new Date(2021, 6, 2),
    profile: {
      name: 'John Daddy',
      aboutBoat: 'Its a mother fucking boat',
      bio: "I'm on a boat",
      birthday,
      boatImage: null,
      hasBoat: true,
      image: null,
      isDaddy: true,
      createdAt: new Date(2021, 6, 1),
      updatedAt: new Date(2021, 6, 1),
      userId: 1,
    },
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
