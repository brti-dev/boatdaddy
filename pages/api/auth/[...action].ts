import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
// const cors = require('cors')
import { AuthenticationError, ForbiddenError } from 'apollo-server-micro'
import { OAuth2Client } from 'google-auth-library'
import { useRouter } from 'next/router'

const USER_LEVELS = {
  guest: 0,
  customer: 1,
  manager: 2,
  admin: 3,
}

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

const getJwt = (req: NextApiRequest) => {
  const header = req.headers.authorization

  if (typeof header === 'undefined') {
    return null
  }

  const bearer = header.split(' ')
  const token = bearer[1]

  return token
}

function getUser(req: NextApiRequest) {
  const token = getJwt(req)
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

export default async function Auth(req: NextApiRequest, res: NextApiResponse) {
  const router = useRouter()
  const action = router.query.action

  if (action === 'login') {
    if (!JWT_SECRET) {
      res.status(500).send('Missing JWT_SECRET. Authentication refused.')
    }

    const { method, token } = req.body

    if (!token) {
      res.status(400).send('Missing Token')
      return
    }

    /**
     * Object to save as JSON web token cookie, UI access
     */
    let credentials: any = { method }

    try {
      switch (method) {
        case 'google':
          const client = new OAuth2Client()
          const ticket = await client.verifyIdToken({ idToken: token })
          const payload = ticket.getPayload()
          console.log('Google auth', payload)
          const { name, email } = payload
          credentials = {
            ...credentials,
            name,
            email,
          }
          break

        case 'testlogin':
          credentials = {
            ...credentials,
            name: 'Boat Daddy',
            email: 'daddy@boatdaddy.app',
          }
          break

        default:
          throw new Error(`Unknown login method '${method}'`)
      }
    } catch (error) {
      res.status(403).send('Invalid credentials')
    }

    // Find user in db, and register if not found
    // const foundUser = await userResolver.get(null, { email: credentials.email })
    // if (foundUser) {
    //   credentials.id = foundUser.id
    //   credentials.level = foundUser.level
    // } else {
    //   logger.info('User registration', credentials)
    //   try {
    //     credentials.level = 'customer'
    //     const savedUser = await userResolver.add(null, { input: credentials })
    //     credentials.id = savedUser.id
    //   } catch (error) {
    //     logger.error(error)
    //     let statusCode = 400

    //     if (error.extensions.code === 'BAD_USER_INPUT') {
    //       statusCode = 403
    //     }

    //     res.status(statusCode).send(error)

    //     return
    //   }
    // }

    // await userResolver.updateActivity(credentials.id)

    // Use credentials object as JWT, encrypt it using a secret key
    const jwtoken = jwt.sign(credentials, JWT_SECRET)
    credentials.jwt = jwtoken

    // Set a cookie called jwt with the value as the signed token
    // res.cookie('jwt', jwtoken, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: 'none',
    //     // domain: process.env.COOKIE_DOMAIN,
    // });

    res.json(credentials)
  } else if (action === 'user') {
    res.send(getUser(req))
  }
}

// Clear cookie upon logout (With JWT enabled it's handled on frontend)
// routes.use('/logout', async (req, res) => {
//     res.clearCookie('jwt');
//     res.json({ status: 'ok', user: getUser(req) });
// });

function getUserLevel(levelString) {
  if (USER_LEVELS[levelString]) {
    return USER_LEVELS[levelString]
  }

  return 0
}

function mustBeLoggedIn(resolver) {
  return (root, args, { user }) => {
    if (!user || !user.isLoggedIn) {
      throw new AuthenticationError('Must be signed in')
    }

    return resolver(root, args, { user })
  }
}

function mustBeManager(resolver) {
  return (root, args, { user }) => {
    if (!user || USER_LEVELS[user.level] < USER_LEVELS.manager) {
      throw new ForbiddenError('Not authorized to perform this action')
    }

    return resolver(root, args, { user })
  }
}

function mustBeAdmin(resolver) {
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
function verifyIsOwner(owner, user, action) {
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
function resolveUser(_, args, { user }) {
  return user
}

module.exports = {
  getUser,
  mustBeLoggedIn,
  mustBeManager,
  mustBeAdmin,
  resolveUser,
  getUserLevel,
  verifyIsOwner,
}
