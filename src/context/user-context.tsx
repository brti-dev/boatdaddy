import { createContext, useContext } from 'react'

import { useAuth } from './auth-context'

const UserContext = createContext(undefined)

function UserProvider(props) {
  const {
    data: { user },
  } = useAuth()

  return <UserContext.Provider value={user} {...props} />
}

function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserProvider`)
  }

  return context
}

export { UserProvider, useUser }
