import { useQuery, gql } from '@apollo/client'

import Layout from 'src/components/Layout'
import Map from 'src/components/Map'
import classes from 'src/styles/hail.module.scss'

export default function Hail() {
  return (
    <Layout title="Hail A Boat Daddy" showFooter={false}>
      <div className={classes.map}>
        <Map />
      </div>
      <div className={classes.hail}>
        <h5>Hail these daddies</h5>
        <>...</>
      </div>
    </Layout>
  )
}

Hail.auth = true
