import Link from 'next/link'
import { gql, useQuery } from '@apollo/client'
import ContentLoader from 'react-content-loader'

import { RideList_data } from 'interfaces/api/ride'
import { useUser } from 'context/user-context'
import Layout from 'components/Layout'
import ErrorPage from 'components/ErrorPage'
import Date from 'components/Date'
import { AvatarGroup } from 'components/Avatar'
import { BoatAvatar, BoatName, ProfileAvatar } from 'components/Profile'

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

const Loader = props => (
  <ContentLoader
    speed={2}
    width={400}
    height={150}
    viewBox="0 0 400 150"
    foregroundColor="#ecebeb"
    {...props}
  >
    <circle cx="10" cy="20" r="8" />
    <rect x="25" y="15" rx="5" ry="5" width="220" height="10" />
    <circle cx="10" cy="50" r="8" />
    <rect x="25" y="45" rx="5" ry="5" width="220" height="10" />
    <circle cx="10" cy="80" r="8" />
    <rect x="25" y="75" rx="5" ry="5" width="220" height="10" />
    <circle cx="10" cy="110" r="8" />
    <rect x="25" y="105" rx="5" ry="5" width="220" height="10" />
  </ContentLoader>
)

const Rides = () => {
  const { data: user } = useUser()
  const { data, error, loading } = useQuery<RideList_data>(RIDES_QUERY, {
    variables: { riderId: user.id },
  })

  if (error)
    return <ErrorPage message={error.message ?? 'Something went wrong'} />

  return (
    <Layout title="Your Rides with Boat Daddy">
      <h1>Your Rides</h1>
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '1em',
        }}
      >
        {!data || loading ? (
          <Loader />
        ) : (
          data.rideList.rides.map(ride => (
            <li key={ride.id}>
              <Link href={`/rides/${ride.id}`}>
                <a style={{ display: 'flex', gap: '1em' }}>
                  <Date date={ride.startedAt} />
                  <AvatarGroup>
                    <ProfileAvatar user={ride.driver.user} tooltip />
                    <BoatAvatar user={ride.driver.user} tooltip />
                  </AvatarGroup>
                  <BoatName>{ride.driver.user.profile.boatName}</BoatName>
                </a>
              </Link>
            </li>
          ))
        )}
      </ul>
    </Layout>
  )
}

Rides.auth = true

export default Rides
