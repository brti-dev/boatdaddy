import { createContext, useContext, useEffect, useMemo } from 'react'

import { User } from 'src/interfaces/user'
import { useAuth } from './auth-context'
import { getUserLazy } from 'src/user'

const UserContext =
  createContext<{ data: User; loading: boolean; error: any }>(undefined)

/**
 * Context provider wrapper component at <AppProviders>
 * This component will provide details about the authenticated user
 */
function UserProvider(props) {
  const { data: auth } = useAuth()
  const [getUser, user] = getUserLazy()

  useEffect(() => {
    if (auth?.userId) {
      getUser({ id: auth.userId })
    }
  }, [auth])

  const value = useMemo(() => user, [user])

  return <UserContext.Provider value={value} {...props} />
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
