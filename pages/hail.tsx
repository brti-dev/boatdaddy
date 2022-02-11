import { useEffect, useRef, useState } from 'react'
import { useQuery, gql } from '@apollo/client'

import { useUser } from 'src/context/user-context'
import Layout from 'src/components/Layout'
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

export default function Hail() {
  const user = useUser()
  const [mapState, setMapState] = useState(null)

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
        <>{mapState ? JSON.stringify(mapState) : '...'}</>
      </div>
    </Layout>
  )
}

Hail.auth = true
