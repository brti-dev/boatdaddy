import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useQuery, gql } from '@apollo/client'
import process from 'process'

import { Session } from 'src/graphql/generated/globalTypes'

type Provider = 'GOOGLE' | 'MOCK' | 'PASSWORD'

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
  query About2 {
    about
  }
  # query Session {
  #   provider
  #   username
  #   email
  #   id
  # }
`

const AuthContext = createContext(undefined)

function AuthProvider(props) {
  const [data, setData] = useState(null)

  const authResult = useQuery(AUTH_QUERY)
  console.log('session result', authResult)

  useEffect(() => {
    setData(authResult?.data)
  }, [authResult])

  const login = async (reqBodyObject: AuthBody) => {
    const AUTH_ENDPOINT = process.env.NEXT_PUBLIC_AUTH_ENDPOINT
    console.log(`login to auth endpoint at ${AUTH_ENDPOINT}`)
    const response = await fetch(`${AUTH_ENDPOINT}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBodyObject),
    })
    const body = await response.text()
    const result: AuthResponse = JSON.parse(body)

    console.log('login result', result)

    if (result.error) {
      throw new Error(result.error)
    }

    setData(result)
  }

  const register = () => {} // register the user
  const logout = () => {} // clear the token in localStorage and the user data

  const value = useMemo(
    () => ({ data, login, logout, register }),
    [data, login, logout, register]
  )

  return <AuthContext.Provider value={value} {...props} />
}

function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }

  return context
}

export { AuthProvider, useAuth }
