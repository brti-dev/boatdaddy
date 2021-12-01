import { Context } from 'src/interfaces/api/context'
import { DeleteResult } from 'src/interfaces/api/globalTypes'
import userResolver from './user'
import {
  Ride,
  RideAddInput_input,
  RideVariables,
  RideListVariables,
  RideList,
  RideUpdateInput_input,
  RideDeleteInput_input,
} from 'src/interfaces/api/ride'
import { UserInputError } from 'apollo-server-errors'

async function add(
  _,
  { input }: RideAddInput_input,
  ctx: Context
): Promise<Ride> {
  console.log('Adding ride from input', input)
  const { driverId, riderId } = input
  const { prisma } = ctx

  const driver = await prisma.actor.findFirst({
    where: { userId: driverId, role: 'DRIVER' },
  })
  if (!driver) {
    throw new UserInputError(
      `No driver data for user ID '${driverId}: That user may not exist, or have permission for the role of 'DRIVER'.`
    )
  }

  const rider = await prisma.actor.findFirst({
    where: { userId: riderId, role: 'RIDER' },
  })
  if (!rider) {
    throw new UserInputError(
      `No rider data for user ID '${riderId}: That user may not exist, or have permission for the role of 'RIDER'.`
    )
  }

  const ride = await prisma.ride.create({
    data: {
      startedAt: new Date(),
      driverId: driver.id,
      riderId: rider.id,
    },
  })

  console.log('Ride added', ride)

  return get(_, { id: ride.id }, ctx)
}

async function get(_, vars: RideVariables, ctx: Context): Promise<Ride | null> {
  const { prisma } = ctx

  if (vars.id) {
    const foundRide = await prisma.ride.findUnique({
      where: { id: vars.id },
      include: { rider: true, driver: true },
    })

    const rider = await userResolver.get(_, { id: foundRide.rider.userId }, ctx)
    const driver = await userResolver.get(
      _,
      { id: foundRide.driver.userId },
      ctx
    )

    const ride = {
      ...foundRide,
      rider: { ...foundRide.rider, user: rider },
      driver: { ...foundRide.driver, user: driver },
    }

    return ride
  }

  return null
}

async function list(
  _,
  vars: RideListVariables,
  ctx: Context
): Promise<RideList> {
  const { session, prisma } = ctx
  const { page = 1, ...where } = vars

  console.log('ridelist', `page ${page}`, where)

  const rides = await prisma.ride.findMany({
    where,
    include: {
      rider: { include: { user: true } },
      driver: { include: { user: true } },
    },
  })

  const ridesWithUsers = rides.map(ride => {
    return {
      ...ride,
      rider: { ...ride.rider, user: userResolver.attachRoles(ride.rider.user) },
      driver: {
        ...ride.driver,
        user: userResolver.attachRoles(ride.driver.user),
      },
    }
  })

  return {
    rides: ridesWithUsers,
    pages: 1,
  }
}

async function update(
  _,
  vars: RideUpdateInput_input,
  ctx: Context
): Promise<Ride> {
  const { prisma } = ctx
  const { id, input } = vars

  const updateResult = await prisma.ride.update({ data: input, where: { id } })

  const updatedRide = await get(_, { id }, ctx)

  return updatedRide
}

const remove = async (
  _,
  vars: RideDeleteInput_input,
  ctx: Context
): Promise<DeleteResult> => {
  const { id } = vars
  const { prisma } = ctx

  try {
    const deleteResult = await prisma.ride.delete({ where: { id } })

    console.log('delete Ride', id, deleteResult)

    return {
      success: true,
      numberDeleted: 1,
      message: `Deleted the following record: ${JSON.stringify(deleteResult)}`,
    }
  } catch (err) {
    return { success: false, numberDeleted: 0, message: String(err) }
  }
}

export default { add, get, list, update, delete: remove }
