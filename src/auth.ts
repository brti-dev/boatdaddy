import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { AuthenticationError, ForbiddenError } from 'apollo-server-micro'

import { Session } from 'src/interfaces/user'

let JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  if (process.env.NODE_ENV !== 'production') {
    JWT_SECRET = '__tempjwtsecretfordevonly__'
    console.warn('Missing env var JWT_SECRET. Using unsafe secret for dev env.')
  } else {
    throw new AuthenticationError(
      'Missing env var JWT_SECRET. Authentication cannot proceed.'
    )
  }
}

function getJwt(req: NextApiRequest) {
  const header = req.headers.authorization

  if (typeof header === 'undefined') {
    return null
  }

  const bearer = header.split(' ')
  const token = bearer[1]

  return token
}

function getSession(req: NextApiRequest): Session | null {
  const token = getJwt(req)
  if (!token) {
    return null
  }

  try {
    const credentials = jwt.verify(token, JWT_SECRET) as Session
    console.log('Credentials from token', credentials)

    return credentials
  } catch (error) {
    console.error(error)

    return null
  }
}

export { JWT_SECRET, getSession }
