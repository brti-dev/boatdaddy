import { Ride as RideType } from '../ride'

export interface Ride extends RideType {}

export interface Ride_data {
  ride: Ride | null
}

export interface RideAddInput {
  driverId: number
  riderId: number
}

export interface RideAddInput_input {
  input: RideAddInput
}

export interface RideDeleteInput_input {
  id: number
}

export interface RideVariables {
  id: number
}

export interface RideList {
  rides: Ride[]
  pages: number
}

export interface RideList_data {
  rideList: Ride[]
}

export interface RideListVariables {
  // User ID of the driver
  driverId?: number
  // User ID of the rider
  riderId?: number
  page?: number
}

export interface RideUpdateInput {
  finishedAt?: any
}

export interface RideUpdateInput_input {
  id: number
  input: RideUpdateInput
}
