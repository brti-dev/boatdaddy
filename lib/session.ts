export type Session = {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    identity?: object | null
  }
  expires?: string
}
