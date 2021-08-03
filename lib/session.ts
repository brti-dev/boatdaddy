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

export const USERNAME_TESTS = [
  {
    test: (value: string) => /^[a-z]/i.test(value),
    message: 'Username must begin with a letter',
  },
  {
    test: (value: string) => value.length >= 3,
    message: 'Username must be at least three characters long',
  },
  {
    test: (value: string) => value.length <= 25,
    message: 'Username must be 25 characters or less',
  },
  {
    test: (value: string) => /\s/.test(value) == false,
    message: 'Username cannot contain any space characters',
  },
]
