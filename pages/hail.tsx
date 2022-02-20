import { useEffect, useRef, useState } from 'react'
import { useLazyQuery, gql } from '@apollo/client'
import router, { useRouter } from 'next/router'
import Link from 'next/link'

import {
  NearbyDrivers_variables,
  NearbyDrivers_data,
  User,
} from 'src/interfaces/api/user'
import userDataFragment from 'src/graphql/fragments/user-data'
import { useUser } from 'src/context/user-context'
import Layout from 'src/components/Layout'
import Button from 'src/components/Button'
import Map, { MapMarker, ViewportState } from 'src/components/Map'
import { ProfileAvatar, BoatName } from 'src/components/Profile'
import BoatImage from 'src/components/BoatImage'
import classes from 'src/styles/map.module.scss'

const NEARBY_DRIVERS_QUERY = gql`
  query nearbyDrivers($bounds: String) {
    nearbyDrivers(bounds: $bounds) {
      ...userData
    }
  }
  ${userDataFragment}
`

const HAIL = ['DonSoprano', 'G.O.B.', 'CommodoreHull', 'Fuuuuuuu']

export default function Hail() {
  const {
    query: { driver },
  } = useRouter()
  const user = useUser()
  const [mapState, setMapState] = useState<ViewportState>(null)
  const [getNearby, nearby] = useLazyQuery<
    NearbyDrivers_data,
    NearbyDrivers_variables
  >(NEARBY_DRIVERS_QUERY)

  const setDriver = driver =>
    router.replace(driver ? '/hail?driver=' + driver : '/hail', undefined, {
      shallow: true,
    })

  useEffect(() => {
    console.log('map state effect', mapState)
    if (!mapState?.bounds) {
      return
    }
    getNearby({
      variables: {
        bounds: `[[${mapState.bounds[0][0]},${mapState.bounds[0][1]}],[${mapState.bounds[1][0]},${mapState.bounds[1][1]}]]`,
      },
    })
  }, [mapState])

  return (
    <Layout title="Hail A Boat Daddy" showFooter={false}>
      <div className={classes.map}>
        <Map onChange={setMapState}>
          <>
            <MapMarker
              latitude={user.data.latitude}
              longitude={user.data.longitude}
            >
              📍
            </MapMarker>
            {nearby.data?.nearbyDrivers &&
              nearby.data.nearbyDrivers.map(driver => (
                <MapMarker
                  latitude={driver.latitude}
                  longitude={driver.longitude}
                  key={driver.id}
                >
                  <ProfileAvatar size={30} user={driver} />
                </MapMarker>
              ))}
          </>
        </Map>
      </div>
      <div className={classes.hail}>
        {driver ? (
          <div>
            <strong>Hailing @{driver}...</strong>
            <Button
              variant="contained"
              color="red"
              onClick={() => setDriver(null)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <>
            <h5>Hail these daddies</h5>
            <NearbyList
              data={nearby.data as NearbyDrivers_data}
              error={nearby.error}
              loading={nearby.loading}
            />
          </>
        )}
      </div>
    </Layout>
  )
}

function NearbyList({
  data,
  error,
  loading,
}: {
  data: NearbyDrivers_data
  error: any
  loading: boolean
}) {
  if (error) {
    console.error(error)
    return <>Something went wrong</>
  }

  if (loading) {
    return <>...</>
  }

  if (!data || !data?.nearbyDrivers?.length) {
    return <>No drivers nearby</>
  }

  return (
    <div className={classes.driverCards}>
      {data.nearbyDrivers.map(user => (
        <DriverCard user={user} key={user.id} />
      ))}
    </div>
  )
}

function DriverCard({ user }: { user: User }) {
  return (
    <div className={classes.driverCard}>
      <div className="heading">
        <h5>{user.profile.name ?? user.username}</h5>
        <ProfileAvatar user={user} />
      </div>
      <div className="details">
        <div>
          <div className="icon">@</div>
          <span>{user.username}</span>
        </div>
        <div>
          <div className="icon">📍</div>
          <span>New York</span>
        </div>
        <div>
          <div className="icon">🛥️</div>
          <span>
            <BoatName>{user.profile.boatName}</BoatName>
          </span>
        </div>
      </div>
      {user.profile.boatImage && (
        <BoatImage
          src={user.profile.boatImage}
          alt={`${user.username}'s boat`}
          dpr="auto"
          quality="auto"
          gravity="auto"
        />
      )}
      <Button
        variant="contained"
        color="primary"
        to={`/hail/?driver=${user.username}`}
      >
        Hail {user.username}
      </Button>
      <Button to={`/@${user.username}`}>More information</Button>
    </div>
  )
}

Hail.auth = true
