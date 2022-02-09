import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { Session, Provider } from 'src/interfaces/user'
import { Auth_data } from 'src/interfaces/api/auth'
import { UserUpdateInput_input } from 'src/interfaces/api/user'
import useLocalStorage from 'src/lib/use-local-storage'
import { getUserAsync } from 'src/user'
import graphQlFetch from 'src/graphql/fetch'

const DEFAULT_LAT = 41.49
const DEFAULT_LONG = -73.45

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

const AUTH_QUERY = `
  query {
    auth {
      provider
      userId
      username
      roles
    }
  }
`

const USER_UPDATE_MUTATION = `
  mutation userUpdate($id: Int!, $input: UserUpdateInput!) {
    userUpdate(id: $id, input: $input) {
      id
    }
  }
`
type UserUpdate_data = {
  id: number
}

const AuthContext = createContext(undefined)

const updateUserData = async (vars: UserUpdateInput_input) => {
  console.log('Update user', vars)
  const userUpdateRes = await graphQlFetch<
    UserUpdate_data,
    UserUpdateInput_input
  >(USER_UPDATE_MUTATION, vars)
  console.log(userUpdateRes)
}

function AuthProvider(props) {
  const [data, setData] = useState<Session>(null)
  const [jwt, setJwt] = useLocalStorage<string>('jwt', '')

  // If token persists in localStorage, query API for user session
  // Authorization with bearer token is automatically attached to the request
  useEffect(() => {
    if (!jwt) {
      return
    }

    const fetchData = async () => {
      const authRes = await graphQlFetch<Auth_data>(AUTH_QUERY)
      if (!authRes.data) {
        return
      }
      if (!authRes.data.auth) {
        setData(null)

        return
      }

      const user = await getUserAsync({ id: authRes.data.auth.userId })
      if (!user) {
        return
      }

      if (!navigator.geolocation) {
        console.warn(
          'Geolocation is not supported by current browser; Using default position'
        )
        updateUserData({
          id: user.id,
          input: { latitude: DEFAULT_LAT, longitude: DEFAULT_LONG },
        })
      } else {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords
            updateUserData({ id: user.id, input: { latitude, longitude } })
          },
          () => {
            console.error(
              'Unable to retrieve your location; Using default position'
            )
            updateUserData({
              id: user.id,
              input: { latitude: DEFAULT_LAT, longitude: DEFAULT_LONG },
            })
          }
        )
      }

      const session: Session = {
        provider: authRes.data.auth.provider,
        userId: user.id,
        ...user,
      }
      setData(session)
    }
    fetchData()
  }, [jwt])

  const login = async (params: AuthBody) => {
    const response = await fetch(`/api/auth/login`, {
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
  }

  const register = () => {} // register the user

  const logout = () => {
    // clear the token in localStorage and the user data
    setJwt('')
    setData(null)
  }

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
