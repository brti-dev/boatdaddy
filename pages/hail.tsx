import { useQuery, gql } from '@apollo/client'

import Layout from 'src/components/Layout'
import Map from 'src/components/Map'
import classes from 'styles/hail.module.scss'
import { About } from 'src/graphql/generated/About'

// Results in: .../Sites/boatdaddy/pages/hail.tsx: Cannot query field "foo" on type "Query". Validation of GraphQL query document failed
const FOO_QUERY = gql`
  query FooQuery {
    foo
  }
`

export default function Hail() {
  const { data }: { data: any } = useQuery(FOO_QUERY)

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
