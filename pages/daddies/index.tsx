import { gql, useQuery } from '@apollo/client'

import { UserList_data } from 'src/interfaces/api/user'
import Layout from 'src/components/Layout'
import ErrorPage from 'src/components/ErrorPage'
import Loading from 'src/components/Loading'
import userDataFragment from 'src/graphql/fragments/user-data'

const DADDIES_QUERY = gql`
  query {
    userList(isBoatDaddy: true) {
      users {
        ...userData
      }
    }
  }
  ${userDataFragment}
`

export default function Daddies() {
  const { data, error, loading } = useQuery<UserList_data>(DADDIES_QUERY)

  if (error)
    return <ErrorPage message={error.message ?? 'Something went wrong'} />

  return (
    <Layout title="Boat Daddies">
      <h1>Boat Daddies</h1>
      {!data || loading ? <Loading /> : <p>{JSON.stringify(data.userList)}</p>}
    </Layout>
  )
}
