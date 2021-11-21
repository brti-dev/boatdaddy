import Head from 'next/head'
import Image from 'next/image'

import Layout from 'src/components/Layout'
import classes from 'styles/index.module.scss'
import Button from 'src/components/Button'

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Boat Daddy</title>
        <meta
          name="description"
          content="Hail a boat daddy to take you on an adventure"
        />
      </Head>
      <main>
        <p className={classes.heading}>
          <strong>Boat Daddy</strong> is the boat hailing app that connects you
          to daddies on boats nearby.
        </p>
        <div className={classes.hero}>
          <Button to="/hail" variant="contained" color="secondary">
            Hail a Boat Daddy
          </Button>
          <Image
            src="/img/hero_redshortsdaddy.jpg"
            alt="Boat daddy in red shorts"
            width={1920}
            height={1280}
          />
        </div>
      </main>
    </Layout>
  )
}
