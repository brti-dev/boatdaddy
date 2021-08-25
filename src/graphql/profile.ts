import {
  Field,
  ObjectType,
  Int,
  Mutation,
  Authorized,
  Resolver,
  ID,
  Query,
  Arg,
  Ctx,
} from 'type-graphql'
import { Min, Max } from 'class-validator'

import { Context, AuthorizedContext } from './context'

@ObjectType()
class Profile {
  @Field(type => Int)
  id: number

  @Field(type => Int)
  userId: number

  @Field()
  name: string

  @Field()
  username: string

  @Field({ nullable: true })
  image: string

  @Field()
  birthday: Date

  @Field()
  isDaddy: boolean

  @Field()
  hasBoat: boolean

  @Field({ nullable: true })
  bio: string

  @Field({ nullable: true })
  aboutBoat: string

  @Field({ nullable: true })
  boatImage: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}

@Resolver(Profile)
export class ProfileResolver {
  // constructor(ctx: Context) {}

  @Query(returns => Profile, { nullable: true })
  async profile(
    @Arg('username') username: string,
    @Ctx() ctx: Context
  ): Promise<Profile | null> {
    const user = await ctx.prisma.identity.findUnique({
      where: { username },
      include: { User: { select: { image: true } } },
    })

    if (!user || Object.keys(user).length === 0) {
      return null
      //`The requested resource (username '${username}') could not be found`,
    }

    const profile_ = { ...user, image: user.User?.image }
    delete profile_.User

    return profile_
  }
}
