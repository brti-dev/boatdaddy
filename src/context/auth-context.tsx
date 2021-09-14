import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useQuery, gql } from '@apollo/client'

/**
 * Object to send in HTTP body request at auth API
 */
export type AuthBody = {
  provider: 'GOOGLE' | 'MOCK' | 'PASSWORD'
  token: string
  email?: string
  password?: string
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
    const apiEndpoint = process.env.UI_AUTH_ENDPOINT
    const response = await fetch(`${apiEndpoint}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBodyObject),
    })
    const body = await response.text()
    const result = JSON.parse(body)

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
