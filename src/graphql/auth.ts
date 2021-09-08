import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { AuthenticationError, ForbiddenError } from 'apollo-server-micro'

import { AuthChecker } from 'type-graphql'
import { Context } from './context'

const USER_LEVELS = {
  guest: 0,
  customer: 1,
  manager: 2,
  admin: 3,
}

export const authChecker: AuthChecker<Context> = ({ context }) => {
  const { uid } = context
  return !!uid
}

export function getJwtSecret() {
  let { JWT_SECRET } = process.env

  if (!JWT_SECRET) {
    if (process.env.NODE_ENV !== 'production') {
      JWT_SECRET = 'tempjwtsecretfordevonly'
      console.warn(
        'Missing env var JWT_SECRET. Using unsafe secret for dev purpose.'
      )
    } else {
      console.error('Missing env var JWT_SECRET. Authentication disabled.')
    }
  }

  return JWT_SECRET
}

export const getJwt = (req: NextApiRequest) => {
  const header = req.headers.authorization

  if (typeof header === 'undefined') {
    return null
  }

  const bearer = header.split(' ')
  const token = bearer[1]

  return token
}

export function getUser(req: NextApiRequest) {
  const token = getJwt(req)
  const JWT_SECRET = getJwtSecret()
  if (!token) {
    return {}
  }

  try {
    const credentials = jwt.verify(token, JWT_SECRET)

    return credentials
  } catch (error) {
    return { isLoggedIn: false, error: { isError: true, message: error } }
  }
}

// Clear cookie upon logout (With JWT enabled it's handled on frontend)
// routes.use('/logout', async (req, res) => {
//     res.clearCookie('jwt');
//     res.json({ status: 'ok', user: getUser(req) });
// });

export function getUserLevel(levelString) {
  if (USER_LEVELS[levelString]) {
    return USER_LEVELS[levelString]
  }

  return 0
}

export function mustBeLoggedIn(resolver) {
  return (root, args, { user }) => {
    if (!user || !user.isLoggedIn) {
      throw new AuthenticationError('Must be signed in')
    }

    return resolver(root, args, { user })
  }
}

export function mustBeManager(resolver) {
  return (root, args, { user }) => {
    if (!user || USER_LEVELS[user.level] < USER_LEVELS.manager) {
      throw new ForbiddenError('Not authorized to perform this action')
    }

    return resolver(root, args, { user })
  }
}

export function mustBeAdmin(resolver) {
  return (root, args, { user }) => {
    if (!user || USER_LEVELS[user.level] < USER_LEVELS.admin) {
      throw new ForbiddenError('Not authorized to perform this action')
    }

    return resolver(root, args, { user })
  }
}

/**
 * A NON-RESOLVER function to check user actions
 *
 * @param {object} owner A user object; Must have `id` prop
 * @param {object} user A user object; Must have `id` and `level` props
 * logging purposes only
 */
export function verifyIsOwner(owner, user, action) {
  if (
    owner.id !== user.id &&
    getUserLevel(user.level) < getUserLevel('manager')
  ) {
    throw new ForbiddenError('Not authorized to perform this action')
  }
}

/**
 * Get the user session from context
 */
export function resolveUser(_, args, { user }) {
  return user
}
