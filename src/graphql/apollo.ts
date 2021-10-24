import { useMemo } from 'react'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { createHttpLink } from '@apollo/client/link/http'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: '/api/graphql',
  // credentials: 'same-origin',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('jwt')
  console.log('token for Apollo client', token)

  // Return the headers to context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

function createApolloClient() {
  console.log('🔆 Creating Apollo client')
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
  })
}

export function useApollo() {
  const client = useMemo(() => createApolloClient(), [])

  return client
}
