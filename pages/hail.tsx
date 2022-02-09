import { useEffect, useRef, useState } from 'react'
import { useQuery, gql } from '@apollo/client'

import Layout from 'src/components/Layout'
import Map from 'src/components/Map'
import classes from 'src/styles/hail.module.scss'

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
  const [mapState, setMapState] = useState(null)

  // Only query API after timeout to prevent superfluous calls while user is
  // changing map state (zooming, panning, etc)
  const timerRef = useRef(null)
  useEffect(() => {
    console.log('state effect')
    if (timerRef.current) {
      console.log('cancel')
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => console.log('Hey 🎉'), 500)
    return () => clearTimeout(timerRef.current)
  }, [mapState])

  return (
    <Layout title="Hail A Boat Daddy" showFooter={false}>
      <div className={classes.map}>
        <Map onChange={setMapState} />
      </div>
      <div className={classes.hail}>
        <h5>Hail these daddies</h5>
        <>{mapState ? JSON.stringify(mapState) : '...'}</>
      </div>
    </Layout>
  )
}

Hail.auth = true
