import Layout from '@/components/Layout'
import Map from '@/components/Map'
import classes from '@/styles/hail.module.scss'

export default function Hail() {
  return (
    <Layout title="Hail A Boat Daddy" showFooter={false}>
      <div className={classes.map}>
        <Map />
      </div>
      <div className={classes.hail}>Hail these daddies</div>
    </Layout>
  )
}

Hail.auth = true
