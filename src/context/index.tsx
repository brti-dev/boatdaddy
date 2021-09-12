import { ApolloProvider } from '@apollo/client'

import { useApollo } from 'src/graphql/apollo'
import { AuthProvider } from 'src/context/auth-context'
import { UserProvider } from 'src/context/user-context'

function AppProviders({ children }) {
  const client = useApollo()

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <UserProvider>{children}</UserProvider>
      </AuthProvider>
    </ApolloProvider>
  )
}

export default AppProviders
