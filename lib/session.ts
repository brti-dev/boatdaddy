export type Identity = {
  name?: string
  username?: string
  birthday?: string
  isDaddy?: Boolean
  hasBoat?: Boolean
  createdAt?: string
  updatedAt?: string
}

export type Session = {
  user?: {
    id?: number | null
    name?: string | null
    email?: string | null
    image?: string | null
    identity?: Identity
  }
  expires?: string
}
