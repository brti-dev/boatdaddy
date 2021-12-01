import { gql, useQuery } from '@apollo/client'

import { UserList_data } from 'src/interfaces/api/user'
import Layout from 'src/components/Layout'
import ErrorPage from 'src/components/ErrorPage'
import Loading from 'src/components/Loading'

export default function Daddies() {
  return (
    <Layout title="Boat Daddies">
      <p>daddies</p>
    </Layout>
  )
}
