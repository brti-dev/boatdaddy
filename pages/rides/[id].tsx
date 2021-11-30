import Link from 'next/link'
import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'

import { Ride_data } from 'src/interfaces/api/ride'
import Layout from 'src/components/Layout'
import ErrorPage from 'src/components/ErrorPage'
import Loading from 'src/components/Loading'

const RIDE_QUERY = gql`
  query ride($id: Int) {
    ride(id: $id) {
      startedAt
      finishedAt
      driver
      rider
    }
  }
`

export default function Ride() {
  const { query } = useRouter()
  const id = query.id

  const { data, error, loading } = useQuery<Ride_data>(RIDE_QUERY, {
    variables: { id },
  })

  if (error)
    return <ErrorPage message={error.message ?? 'Something went wrong'} />
  if (!data || loading) return <Loading fullscreen />

  return <Layout>{JSON.stringify(data)}</Layout>
}
