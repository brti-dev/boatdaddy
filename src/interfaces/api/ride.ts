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

export interface RideVariables {
  id: number
}

export interface RideList_data {
  rideList: Ride[]
}

export interface RideListVariables {
  id?: number
  driverId?: number
  riderId?: number
  page?: number
}
