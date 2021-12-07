import { useRouter } from 'next/router'
import Link from 'next/link'
import { gql, useQuery } from '@apollo/client'

import { Ride_data } from 'src/interfaces/api/ride'
import Layout from 'src/components/Layout'
import ErrorPage from 'src/components/ErrorPage'
import Loading from 'src/components/Loading'
import Avatar, { AvatarGroup } from 'src/components/Avatar'
import Date from 'src/components/Date'
import React from 'react'

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
        Ride on <Date date={data.ride.startedAt} />
      </h1>
      <div style={{ display: 'flex', gap: '1em' }}>
        <Link href={`/@${data.ride.rider.user.username}`}>
          <Avatar
            src={data.ride.rider.user.image}
            alt={data.ride.rider.user.username}
            tooltip
            size={80}
          />
        </Link>
        <Link href={`/@${data.ride.driver.user.username}`}>
          <AvatarGroup>
            <Avatar
              src={data.ride.driver.user.image}
              alt={data.ride.driver.user.username}
              tooltip
              size={80}
            />
            <Avatar
              src={data.ride.driver.user.profile.boatImage}
              alt={`"${data.ride.driver.user.profile.boatName ?? 'Boat'}"`}
              tooltip
              size={80}
            />
          </AvatarGroup>
        </Link>
      </div>
      <dl>
        <dt>Started at</dt>
        <dd>
          <Date date={data.ride.startedAt} />
        </dd>
        {data.ride.finishedAt && (
          <>
            <dt>Finished at</dt>
            <dd>
              <Date date={data.ride.finishedAt} />
            </dd>
          </>
        )}
      </dl>
    </Layout>
  )
}
