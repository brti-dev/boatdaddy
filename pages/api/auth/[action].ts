import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'

import { JWT_SECRET, getSession } from 'auth'
import { Session } from 'interfaces/user'
import { AuthBody, AuthResponse } from 'context/auth-context'
import userResolver from 'api/user'

const MOCK_FOUND_USER = {
  id: 1,
  username: 'mrberti',
  roles: ['RIDER', 'DRIVER', 'ADMIN'],
}

async function getAuth(
  action: string,
  req: NextApiRequest
): Promise<AuthResponse> {
  switch (action) {
    case 'test_jwt':
      if (!JWT_SECRET) {
        throw new Error('Error: Missing JWT_SECRET')
      }

      const t_jwtoken = jwt.sign('foo', JWT_SECRET)
      console.log('signed jwt', t_jwtoken)

      const t_data = jwt.verify(t_jwtoken, JWT_SECRET)
      console.log('verified jwt', t_data)

      break

    case 'login':
      if (!JWT_SECRET) {
        throw new Error('Missing JWT_SECRET. Authentication refused.')
      }

      const { provider, token, email, password } = req.body as AuthBody

      if (!token) {
        throw new Error('Missing Token')
      }

      /**
       * Object to save as JSON web token, UI access
       */
      let credentials: any = { provider }

      try {
        switch (provider) {
          case 'GOOGLE':
            const client = new OAuth2Client()
            const ticket = await client.verifyIdToken({ idToken: token })
            const payload = ticket.getPayload()
            console.log('Google auth payload', payload)
            const {
              name,
              email,
              email_verified: emailVerified,
              picture: image,
            } = payload

            credentials = {
              ...credentials,
              name,
              email,
              emailVerified,
              image,
            }

            break

          case 'MOCK':
            credentials = {
              ...credentials,
              name: 'Boat Daddy',
              email: 'john_daddy@boatdaddy.app',
            }
            break

          default:
            throw new Error(`Unknown login provider '${provider}'`)
        }
      } catch (error) {
        console.error(error)
        throw new Error('Invalid credentials')
      }

      // Find user in db, and register if not found
      // const foundUser = MOCK_FOUND_USER
      const foundUser = await userResolver.get({ email: credentials.email })

      if (foundUser) {
        console.log('Found user', foundUser)
        credentials.userId = foundUser.id
        credentials.roles = foundUser.roles
        credentials.username = foundUser.username
      } else {
        console.log('User registration...', credentials)
        const { name, provider, ...newUser } = credentials
        newUser.profile = { name }
        try {
          credentials.roles = ['RIDER']
          const savedUser = await userResolver.add(newUser)
          console.log('Registration result', savedUser)
          // const savedUser = { id: 22 }
          credentials.userId = savedUser.id
          credentials.username = savedUser.username
        } catch (error) {
          throw error
        }
      }

      // await userResolver.updateActivity(credentials.userId)

      // Use credentials object as JWT, encrypt it using a secret key
      // Frontend should save in localstorage
      const sessionForToken: Session = {
        provider,
        userId: credentials.userId,
        username: credentials.username,
        roles: credentials.roles,
      }
      const jwtoken = jwt.sign(sessionForToken, JWT_SECRET)
      credentials.jwt = jwtoken

      return { credentials }

    case 'user':
      const session = getSession(req)

      return { session }

    default:
      throw new Error(`Unknown action '${action}'`)
  }
}

export default async function Auth(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req
  const action = query?.action as string

  try {
    const response: AuthResponse = await getAuth(action, req)

    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
