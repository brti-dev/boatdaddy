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
      driver {
        user {
          id
          username
          profile {
            boatName
          }
        }
      }
      rider {
        user {
          id
          username
        }
      }
    }
  }
`

export default function Ride() {
  const { query } = useRouter()
  const id = Number(query.id)

  const { data, error, loading } = useQuery<Ride_data>(RIDE_QUERY, {
    variables: { id },
  })

  if (error) {
    console.error(error)

    return <ErrorPage message="Something went wrong" />
  }

  if (!data || loading) return <Loading fullscreen />

  return <Layout>{JSON.stringify(data)}</Layout>
}
