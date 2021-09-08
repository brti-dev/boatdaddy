import { ApolloProvider } from '@apollo/client'

import { useApollo } from 'src/graphql/apollo'
import { AuthProvider } from 'src/context/auth-context'
import Loading from 'src/components/Loading'
import ErrorPage from 'src/components/ErrorPage'

import 'normalize.css'
import 'styles/global.scss'

function AppProviders({ children }) {
  const client = useApollo()

  return (
    <ApolloProvider client={client}>
      <AuthProvider>{children}</AuthProvider>
    </ApolloProvider>
  )
}

export default AppProviders
