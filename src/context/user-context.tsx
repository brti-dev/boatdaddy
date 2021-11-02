import { createContext, useContext } from 'react'

import { User } from 'src/interfaces/user'
import { useAuth } from './auth-context'
import { getUser } from 'src/user'

const UserContext =
  createContext<{ data: User; loading: boolean; error: any }>(undefined)

/**
 * Context provider wrapper component at <AppProviders>
 * This component will provide details about the authenticated user
 */
function UserProvider(props) {
  const { data: auth } = useAuth()
  const user = auth?.userId ? getUser({ id: auth.userId }) : null
  const data = user?.data || null
  const loading = user?.loading || false
  const error = user?.error || null

  if (error) {
    console.error(error)
  }

  return <UserContext.Provider value={{ data, loading, error }} {...props} />
}

/**
 * Hook to access context
 */
function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserProvider`)
  }

  return context
}

export { UserProvider, useUser }
