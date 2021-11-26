import { Actor } from './actor'

export interface Ride {
  id: number
  startedAt: any
  finishedAt?: any
  driver: Actor
  rider: Actor
}
