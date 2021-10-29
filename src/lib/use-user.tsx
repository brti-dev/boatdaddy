import { useQuery, gql } from '@apollo/client'

import { useAuth } from 'src/context/auth-context'
import {
  User as UserQuery,
  UserVariables,
  User_data,
} from 'src/interfaces/api/User'

const USER_QUERY = gql`
  query User($username: String, $id: Int) {
    user(username: $username, id: $id) {
      id
      username
      email
      emailVerified
      image
      createdAt
      updatedAt
      profile {
        name
        birthday
        isDaddy
        bio
        hasBoat
        aboutBoat
        boatImage
        createdAt
        updatedAt
      }
    }
  }
`

/**
 * Hook to inject user data into the component. Fetches session user by default.
 */
export default function useUser(vars: UserVariables = null): {
  data: UserQuery
  error: any
  loading: boolean
} {
  const { data: session } = useAuth()

  const userId = vars?.id
  const username = vars?.username ?? session.username

  if (!userId && !username) {
    return {
      data: null,
      error: new Error('No user variables with which to fetch user'),
      loading: false,
    }
  }

  const variables = userId ? { id: userId } : { username }

  const { data, error, loading } = useQuery<User_data, UserVariables>(
    USER_QUERY,
    {
      variables,
    }
  )

  return { data: data?.user, error, loading }
}
