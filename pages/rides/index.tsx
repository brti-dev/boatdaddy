import Link from 'next/link'
import { gql, useQuery } from '@apollo/client'

import { RideList_data } from 'src/interfaces/api/ride'
import Layout from 'src/components/Layout'
import ErrorPage from 'src/components/ErrorPage'
import Loading from 'src/components/Loading'

const RIDES_QUERY = gql`
  query rideList($riderId: number) {
    rideList(riderId: $riderId) {
      id
      startedAt
      finishedAt
      driver
    }
  }
`

export default function Rides() {
  const { data, error, loading } = useQuery<RideList_data>(RIDES_QUERY)

  if (error)
    return <ErrorPage message={error.message ?? 'Something went wrong'} />
  if (!data || loading) return <Loading fullscreen />

  return (
    <Layout title="Your Rides with Boat Daddy">
      <ul>
        {data.rideList.map(ride => (
          <li key={ride.id}>
            <Link href={`/rides/${ride.id}`}>{ride.startedAt}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}
