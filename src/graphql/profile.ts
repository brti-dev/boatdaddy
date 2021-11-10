import {
  Field,
  ObjectType,
  InputType,
  Int,
  Mutation,
  Authorized,
  Resolver,
  ID,
  Query,
  Arg,
  Ctx,
  Float,
} from 'type-graphql'
import { Min, Max, Length, MinDate, MaxDate } from 'class-validator'
import { UserInputError } from 'apollo-server-micro'

import { Context, AuthorizedContext } from './context'
import { USERNAME_TESTS } from 'src/session'

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
  image?: string

  @Field()
  birthday: Date

  @Field()
  isDaddy: boolean

  @Field()
  hasBoat: boolean

  @Field({ nullable: true })
  bio?: string

  @Field({ nullable: true })
  aboutBoat?: string

  @Field({ nullable: true })
  boatImage?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}

@InputType()
class CoordinatesInput {
  @Min(-90)
  @Max(90)
  @Field(type => Float)
  latitude!: number

  @Min(-180)
  @Max(180)
  @Field(type => Float)
  longitude!: number
}

@InputType({ description: 'New Identity type' })
class AddProfileInput implements Partial<Profile> {
  @Field(type => Int)
  userId: number

  @Length(2, 25)
  @Field()
  name: string

  @Field()
  username: string

  @Field({ nullable: true })
  image?: string

  @MinDate(new Date(1900, 1, 1))
  @MaxDate(new Date(new Date().getFullYear() - 13, 1, 1))
  @Field()
  birthday: Date

  @Field()
  isDaddy: boolean

  @Field()
  hasBoat: boolean

  @Field({ nullable: true })
  bio?: string

  @Field({ nullable: true })
  aboutBoat?: string

  @Field({ nullable: true })
  boatImage?: string

  // coordinates!: CoordinatesInput
}

function validate(input: AddProfileInput) {
  USERNAME_TESTS.map(({ test, message }) => {
    if (!test(input.username)) {
      throw new UserInputError(message)
    }
  })
}

@Resolver(Profile)
export class ProfileResolver {
  // constructor(ctx: Context) {}

  @Mutation(returns => Profile)
  async addProfile(
    @Arg('input') input: AddProfileInput,
    @Ctx() ctx: AuthorizedContext
  ): Promise<Profile> {
    validate(input)

    const roles = [{ role: 'RIDER' }]
    if (input.hasBoat) roles.push({ role: 'DRIVER' })

    const { userId, ...data } = input

    const putOperation = {
      data: {
        ...data,
        actor: { create: roles },
        User: { connect: { id: input.userId } },
      },
    }

    // Dummy result
    return {
      ...data,
      id: 1,
      userId: input.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const createResult = await ctx.prisma.identity.create(putOperation)

    return createResult
  }

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
