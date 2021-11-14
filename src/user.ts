import { useQuery, useLazyQuery, gql } from '@apollo/client'
import { print } from 'graphql'

import { User } from 'src/interfaces/user'
import { UserVariables, User_data } from 'src/interfaces/api/User'
import graphQlFetch from './graphql/fetch'

const USER_QUERY = gql`
  query User($username: String, $id: Int, $email: String) {
    user(username: $username, id: $id, email: $email) {
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
      roles
    }
  }
`

export const USERNAME_TESTS = [
  {
    test: (value: string) => /^[a-z]/i.test(value),
    message: 'Username must begin with a letter',
  },
  {
    test: (value: string) => value.length >= 3,
    message: 'Username must be at least three characters long',
  },
  {
    test: (value: string) => value.length <= 25,
    message: 'Username must be 25 characters or less',
  },
  {
    test: (value: string) => /\s/.test(value) == false,
    message: 'Username cannot contain any space characters',
  },
]

/**
 * Hook to fetch a specific user from API
 */
export function getUser(variables: UserVariables): {
  data: User
  error: any
  loading: boolean
} {
  const { data, error, loading } = useQuery<User_data, UserVariables>(
    USER_QUERY,
    {
      variables,
    }
  )

  return { data: data?.user, error, loading }
}

export function getUserLazy(): [
  (variables: UserVariables) => void,
  {
    data: User
    error: any
    loading: boolean
  }
] {
  const [getUser, { data, error, loading, called }] = useLazyQuery<
    User_data,
    UserVariables
  >(USER_QUERY)

  return [
    (variables: UserVariables) => getUser({ variables }),
    { data: data?.user, error, loading: !called ? true : loading },
  ]
}

export async function getUserAsync(
  variables: UserVariables
): Promise<User | null> {
  const res = await graphQlFetch(print(USER_QUERY), variables)

  if (res?.data?.user) {
    return res.data.user
  }

  return null
}
