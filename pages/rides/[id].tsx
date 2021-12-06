import Link from 'next/link'
import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'

import { Ride_data } from 'src/interfaces/api/ride'
import Layout from 'src/components/Layout'
import ErrorPage from 'src/components/ErrorPage'
import Loading from 'src/components/Loading'
import Avatar, { AvatarGroup } from 'src/components/Avatar'
import Date from 'src/components/Date'

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
            image
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

  return (
    <Layout title={`Ride on ${data.ride.startedAt.substring(0, 10)}`}>
      <h1>
        Ride on <Date date={data.ride.startedAt} />
      </h1>
      <div style={{ display: 'flex', gap: '1em' }}>
        <Avatar src={data.ride.rider.user.image} />
        <AvatarGroup>
          <Avatar src={data.ride.driver.user.image} />
          <Avatar src={data.ride.driver.user.profile.boatImage} />
        </AvatarGroup>
      </div>
    </Layout>
  )
}
