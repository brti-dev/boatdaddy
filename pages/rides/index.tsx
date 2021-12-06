import Link from 'next/link'
import { gql, useQuery } from '@apollo/client'

import { RideList_data } from 'src/interfaces/api/ride'
import { useUser } from 'src/context/user-context'
import Layout from 'src/components/Layout'
import ErrorPage from 'src/components/ErrorPage'
import Loading from 'src/components/Loading'
import Date from 'src/components/Date'
import Avatar, { AvatarGroup } from 'src/components/Avatar'
import { BoatName } from 'src/components/Profile'

const RIDES_QUERY = gql`
  query rideList($riderId: Int) {
    rideList(riderId: $riderId) {
      rides {
        id
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
      }
      pages
    }
  }
`

const Rides = () => {
  const { data: user } = useUser()
  const { data, error, loading } = useQuery<RideList_data>(RIDES_QUERY, {
    variables: { riderId: user.id },
  })

  if (error)
    return <ErrorPage message={error.message ?? 'Something went wrong'} />
  if (!data || loading) return <Loading fullscreen />

  console.log(data)

  return (
    <Layout title="Your Rides with Boat Daddy">
      <ul>
        {data.rideList.rides.map(ride => (
          <li key={ride.id}>
            <Link href={`/rides/${ride.id}`}>
              <div style={{ display: 'flex', gap: '1em' }}>
                <Date date={ride.startedAt} />
                <AvatarGroup>
                  <Avatar
                    src={ride.driver.user.image}
                    alt={ride.driver.user.profile.name}
                  />
                  <Avatar
                    src={ride.driver.user.profile?.boatImage}
                    alt={`"${ride.driver.user.profile.boatName || 'Boat'}"`}
                  />
                </AvatarGroup>
                <BoatName>{ride.driver.user.profile.boatName}</BoatName>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

Rides.auth = true

export default Rides
