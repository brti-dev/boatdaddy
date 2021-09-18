import { Context, AuthorizedContext } from './context'

const get = async (_, { username }, ctx: Context) => {
  const user = await ctx.prisma.user.findUnique({
    where: { username },
    include: { profile: true },
  })

  if (!user || Object.keys(user).length === 0) {
    return null
    //`The requested resource (username '${username}') could not be found`,
  }

  console.log('user result', user)

  return user

  // const profile_ = { ...user, image: user.User?.image }
  // delete profile_.User

  // return profile_
}

export default { get }
