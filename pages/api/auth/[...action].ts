import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import { useRouter } from 'next/router'

import { JWT_SECRET, getSession } from 'src/graphql/auth'

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
    const session = getSession(req)

    res.send(session)
  }
}
