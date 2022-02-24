// import { NextApiRequest, NextApiResponse } from 'next'
// import jwt from 'jsonwebtoken'
// import { AuthenticationError, ForbiddenError } from 'apollo-server-micro'
// import { Min, Max } from 'class-validator'

// import { Context, AuthorizedContext } from './context'
// import { Session } from 'interfaces/user'

// enum Provider {
//   Google = 'GOOGLE',
//   Password = 'PASSWORD',
//   Mock = 'MOCK',
// }
// registerEnumType(Provider, {
//   name: 'Auth Providers',
//   description: 'Authorization providers, including third party APIs',
// })

// @ObjectType()
// class Session {
//   @Field(type => Provider)
//   provider: Provider

//   @Field()
//   username: string

//   @Field()
//   email: string

//   @Field(type => Int)
//   id: number

//   // @Field()
//   // isLoggedIn: boolean
// }

// @Resolver(Session)
// export class SessionResolver {
//   // constructor(ctx: Context) {}

//   @Query(returns => Session, { nullable: true })
//   async session(@Ctx() ctx: Context): Promise<Session | null> {
//     const user = await ctx.prisma.user.findUnique({
//       where: { id: ctx.uid },
//       select: { username: true, email: true, id: true },
//     })

//     if (!user || Object.keys(user).length === 0) {
//       return null
//       //`The requested resource (username '${username}') could not be found`,
//     }

//     return { provider: Provider.Mock, ...user }
//   }
// }

const authChecker = ({ context }) => {
  const { uid } = context
  return !!uid
}

// function mustBeLoggedIn(resolver) {
//   return (root, args, { user }) => {
//     if (!user || !user.isLoggedIn) {
//       throw new AuthenticationError('Must be signed in')
//     }

//     return resolver(root, args, { user })
//   }
// }

// function mustBeManager(resolver) {
//   return (root, args, { user }) => {
//     if (!user || USER_LEVELS[user.level] < USER_LEVELS.manager) {
//       throw new ForbiddenError('Not authorized to perform this action')
//     }

//     return resolver(root, args, { user })
//   }
// }

// function mustBeAdmin(resolver) {
//   return (root, args, { user }) => {
//     if (!user || USER_LEVELS[user.level] < USER_LEVELS.admin) {
//       throw new ForbiddenError('Not authorized to perform this action')
//     }

//     return resolver(root, args, { user })
//   }
// }

// /**
//  * A NON-RESOLVER function to check user actions
//  *
//  * @param {object} owner A user object; Must have `id` prop
//  * @param {object} user A user object; Must have `id` and `level` props
//  * logging purposes only
//  */
// function verifyIsOwner(owner, user, action) {
//   if (
//     owner.id !== user.id &&
//     getUserLevel(user.level) < getUserLevel('manager')
//   ) {
//     throw new ForbiddenError('Not authorized to perform this action')
//   }
// }

export { authChecker }
