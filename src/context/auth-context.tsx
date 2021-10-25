import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useQuery, gql } from '@apollo/client'

import { Session } from 'src/interfaces/user'
import { Provider, Roles } from 'src/interfaces/user'
import useLocalStorage from 'src/lib/use-local-storage'

/**
 * Object to send in HTTP body request at auth API
 */
export type AuthBody = {
  provider: Provider
  token: string
  email?: string
  password?: string
}

interface AuthResponseCredentials {
  email: string
  jwt: string
  name: string
  provider: Provider
}

/**
 * JSON returned in response
 */
export type AuthResponse = {
  credentials?: AuthResponseCredentials
  session?: Session
  error?: string
}

const AUTH_QUERY = gql`
  query {
    auth {
      provider
      userId
      username
      roles
    }
  }
`

const AuthContext = createContext(undefined)

function AuthProvider(props) {
  const [data, setData] = useState<Session>(null)

  const [jwt, setJwt] = useLocalStorage<string>('jwt', null)
  console.log('jwt from localstorage:', jwt)

  const authResult = useQuery(AUTH_QUERY)
  console.log('session result', authResult)

  useEffect(() => {
    if (!jwt) {
      return
    }
  }, [data])

  const login = async (params: AuthBody) => {
    const AUTH_ENDPOINT = process.env.NEXT_PUBLIC_AUTH_ENDPOINT
    const response = await fetch(`${AUTH_ENDPOINT}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    const body = await response.text()
    const result: AuthResponse = JSON.parse(body)

    console.log('login result', result)

    if (result.error) {
      throw new Error(result.error)
    }

    const { credentials } = result
    if (!credentials) {
      throw new Error('No credentials found')
    }

    const { jwt } = credentials
    if (!jwt) {
      throw new Error('Missing JWT from credentials')
    }

    setJwt(jwt)

    // TODO: Get user data from credentials (email, jwt, name, provider)
    // ....
    const user = {
      userId: 1,
      username: 'mrberti',
      roles: ['RIDER', 'DRIVER', 'ADMIN'] as Roles,
    }

    const session: Session = {
      provider: credentials.provider,
      ...user,
    }

    setData(session)

    return null
  }

  const register = () => {} // register the user
  const logout = () => {} // clear the token in localStorage and the user data

  const value = useMemo(
    () => ({ data, login, logout, register }),
    [data, login, logout, register]
  )

  return <AuthContext.Provider value={value} {...props} />
}

function useAuth(): {
  data: Session
  login: (params: AuthBody) => Promise<null>
  logout: () => void
  register: () => void
} {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }

  return context
}

export { AuthProvider, useAuth }
