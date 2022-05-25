import { gql, useQuery } from '@apollo/client'
import { AvatarGroup, DateTime } from 'matterial'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'

import { Ride_data } from 'interfaces/api/ride'
import Layout from 'components/Layout'
import ErrorPage from 'components/ErrorPage'
import Loading from 'components/Loading'
import { ProfileAvatar } from 'components/Profile'

const RIDE_QUERY = gql`
  query ride($id: Int) {
    ride(id: $id) {
      startedAt
      finishedAt
      driver {
        user {
          username
          id
          image
          profile {
            name
            boatName
            boatImage
          }
        }
      }
      rider {
        user {
          username
          id
          image
          profile {
            name
          }
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

  if (!data || loading) {
    return <Loading fullscreen />
  }

  return (
    <Layout title={`Ride on ${data.ride.startedAt.substring(0, 10)}`}>
      <h1>
        Ride on <DateTime date={data.ride.startedAt} />
      </h1>
      <div style={{ display: 'flex', gap: '1em' }}>
        <Link href={`/@${data.ride.rider.user.username}`}>
          <a>
            <ProfileAvatar user={data.ride.rider.user} tooltip size={80} />
          </a>
        </Link>
        <Link href={`/@${data.ride.driver.user.username}`}>
          <a>
            <AvatarGroup>
              <ProfileAvatar user={data.ride.driver.user} tooltip size={80} />
              <ProfileAvatar
                boat
                user={data.ride.driver.user}
                tooltip
                size={80}
              />
            </AvatarGroup>
          </a>
        </Link>
      </div>
      <dl>
        <dt>Started at</dt>
        <dd>
          <DateTime date={data.ride.startedAt} />
        </dd>
        {data.ride.finishedAt && (
          <>
            <dt>Finished at</dt>
            <dd>
              <DateTime date={data.ride.finishedAt} />
            </dd>
          </>
        )}
      </dl>
    </Layout>
  )
}
