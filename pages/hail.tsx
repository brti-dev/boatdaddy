import { useEffect, useRef, useState } from 'react'
import { useQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { useUser } from 'src/context/user-context'
import Layout from 'src/components/Layout'
import Button from 'src/components/Button'
import Map, { MapMarker } from 'src/components/Map'
import classes from 'src/styles/map.module.scss'

// const DADDIES_QUERY = gql`
//   query {
//     userList(isBoatDaddy: true) {
//       users {
//         id
//         username
//         image
//         createdAt
//         profile {
//           name
//           birthday
//           isBoatDaddy
//           boatName
//           boatImage
//         }
//       }
//     }
//   }
// `

const HAIL = ['DonSoprano', 'G.O.B.', 'CommodoreHull', 'Fuuuuuuu']

export default function Hail() {
  const router = useRouter()
  const user = useUser()
  const [mapState, setMapState] = useState(null)

  const [driver, setDriver] = useState(router.query?.driver?.slice(1))

  useEffect(() => {
    console.log('driver effect', driver)
  }, [driver])

  return (
    <Layout title="Hail A Boat Daddy" showFooter={false}>
      <div className={classes.map}>
        <Map
          latitude={user.data.latitude}
          longitude={user.data.longitude}
          onChange={setMapState}
        >
          <MapMarker
            latitude={user.data.latitude}
            longitude={user.data.longitude}
          >
            📍
          </MapMarker>
        </Map>
      </div>
      <div className={classes.hail}>
        <h5>Hail these daddies</h5>
        <>
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
            <div>
              {HAIL.map(driver => (
                <Link href={`/hail/@${driver}`} replace shallow>
                  {driver}
                </Link>
              ))}
            </div>
          )}
        </>
        <>{mapState ? JSON.stringify(mapState) : '...'}</>
      </div>
    </Layout>
  )
}

Hail.auth = true
