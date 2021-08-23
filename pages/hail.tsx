import { useQuery, gql } from '@apollo/client'

import Layout from 'src/components/Layout'
import Map from 'src/components/Map'
import classes from 'styles/hail.module.scss'

const ABOUT_QUERY = gql`
  query About {
    about
  }
`

export default function Hail() {
  const { data } = useQuery(ABOUT_QUERY)

  return (
    <Layout title="Hail A Boat Daddy" showFooter={false}>
      <div className={classes.map}>
        <Map />
      </div>
      <div className={classes.hail}>
        <h5>Hail these daddies</h5>
        {JSON.stringify(data, null, 2)}
      </div>
    </Layout>
  )
}

Hail.auth = true
