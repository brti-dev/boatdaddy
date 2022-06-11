import { useLazyQuery, gql } from '@apollo/client'
import { Button } from 'matterial'
import router, { useRouter } from 'next/router'
import * as React from 'react'

import {
  NearbyDrivers_variables,
  NearbyDrivers_data,
} from 'interfaces/api/user'
import userDataFragment from 'api/graphql/fragments/user-data'
import { useUser } from 'context/user-context'
import DriverCard from 'components/DriverCard'
import Layout from 'components/Layout'
import Map, { MapMarker, ViewportState } from 'components/Map'
import { ProfileAvatar } from 'components/Profile'
import classes from 'styles/map.module.scss'

const NEARBY_DRIVERS_QUERY = gql`
  query nearbyDrivers($bounds: String) {
    nearbyDrivers(bounds: $bounds) {
      ...userData
    }
  }
  ${userDataFragment}
`

export default function Hail() {
  const {
    query: { driver },
  } = useRouter()
  const user = useUser()
  const [mapState, setMapState] = React.useState<ViewportState>(null)
  const [getNearby, nearby] = useLazyQuery<
    NearbyDrivers_data,
    NearbyDrivers_variables
  >(NEARBY_DRIVERS_QUERY)

  const setDriver = (driver: string) =>
    router.replace(driver ? `/hail?driver=${driver}` : '/hail', undefined, {
      shallow: true,
    })

  React.useEffect(() => {
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
          <NearbyList
            data={nearby.data as NearbyDrivers_data}
            error={nearby.error}
            loading={nearby.loading}
          />
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

Hail.auth = true
