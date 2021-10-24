import { Context, AuthorizedContext } from './generated/context'
import { Profile } from './generated/Profile'

const get = async (_, { username }, ctx: Context): Promise<Profile> => {
  return {
    profile: {
      __typename: 'Profile',
      aboutBoat: 'Its a mother fucking boat',
      bio: "I'm on a boat",
      birthday: new Date('1980-01-01').toString(),
      boatImage: null,
      hasBoat: true,
      image: null,
      isDaddy: true,
      name: 'John Daddy',
      userId: 1,
      username,
      createdAt: null,
      updatedAt: null,
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
