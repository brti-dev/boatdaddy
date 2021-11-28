import { Context } from 'src/interfaces/api/context'
import { DeleteResult } from 'src/interfaces/api/globalTypes'
import { Actor } from 'src/interfaces/api/actor'
import { UserInputError } from 'apollo-server-errors'

async function get(_, vars, ctx: Context): Promise<Actor | null> {
  return null
  // const {username}=vars
  //   const user = await ctx.prisma.identity.findUnique({
  //     where: { username },
  //     include: { User: { select: { image: true } } },
  //   })

  //   if (!user || Object.keys(user).length === 0) {
  //     return null
  //     //`The requested resource (username '${username}') could not be found`,
  //   }

  //   const profile_ = { ...user, image: user.User?.image }
  //   delete profile_.User

  //   return profile_
  // }
}
