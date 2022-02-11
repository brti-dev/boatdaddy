import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { User } from 'src/interfaces/user'
import { useAuth } from './auth-context'
import { getUserAsync } from 'src/user'
import usePrevious from 'src/lib/use-previous'

const UserContext =
  createContext<{ data: User | null; loading: boolean }>(undefined)

/**
 * Context provider wrapper component at <AppProviders>
 * This component will provide details about the authenticated user
 */
function UserProvider(props) {
  const auth = useAuth()
  const [user, setUser] = useState({ data: null, loading: true })

  useEffect(() => {
    // Track auth context until loading finishes, then get user data if auth
    // token exists
    if (auth.loading) {
      return
    }
    if (auth && auth?.data?.userId) {
      getUserAsync({ id: auth.data.userId }).then(data => {
        setUser({ data, loading: false })
      })
    } else {
      setUser(u => ({ ...u, loading: false }))
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
