import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'

import { JWT_SECRET, getSession } from 'src/auth'
import { AuthBody, AuthResponse } from 'src/context/auth-context'

async function getAuth(
  action: string,
  req: NextApiRequest
): Promise<AuthResponse> {
  switch (action) {
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
            console.log('Google auth', payload)
            const { name, email } = payload
            credentials = {
              ...credentials,
              name,
              email,
            }
            break

          case 'MOCK':
            credentials = {
              ...credentials,
              name: 'Boat Daddy',
              email: 'daddy@boatdaddy.app',
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
      // const foundUser = await userResolver.get(null, { email: credentials.email })
      const foundUser = { id: 1, roles: ['RIDER', 'DRIVER'] }
      if (foundUser) {
        credentials.id = foundUser.id
        credentials.roles = foundUser.roles
      } else {
        console.log('User registration', credentials)
        try {
          credentials.roles = ['RIDER']
          // const savedUser = await userResolver.add(null, { input: credentials })
          const savedUser = { id: 22 }
          credentials.id = savedUser.id
        } catch (error) {
          throw error
        }
      }

      // await userResolver.updateActivity(credentials.id)

      // Use credentials object as JWT, encrypt it using a secret key
      // Frontend should save in localstorage
      const jwtoken = jwt.sign(credentials, JWT_SECRET)
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
