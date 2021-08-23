import Image from 'next/image'

import Layout from 'src/components/Layout'
import classes from 'styles/about.module.scss'
import photoAttribution from '../public/img/hero_landscape_attribution'
import photoAttributionHome from '../public/img/hero_redshortsdaddy_attribution'

export default function Home() {
  return (
    <Layout title="About Boat Daddy">
      <main>
        <h1>About Boat Daddy</h1>
        <figure className={classes.hero}>
          <figcaption>
            <strong>Boat Daddy</strong> is the boat hailing app that connects
            you to boats and daddies nearby right now.
          </figcaption>
          <Image
            src="/img/hero_landscape.jpg"
            alt="Watery landscape"
            width={1920}
            height={1280}
          />
        </figure>
        <p className={classes.dropCap}>
          Legend has it that the idea for Boat Daddy began on a fortuitous and
          glorious summer day on the Candlewood Lake in Western Connecticut.
          While the exact circumstances of its founding are lost to history, the
          app was willed into being by co-founder and CEO Maranda Cox in June of
          2021 when she used it to hail her very own Boat Daddy somewhere in the
          Shengsi Islands off the coast of China's Zhejiang Province.
        </p>
        <h2>Attribution</h2>
        <p>{photoAttribution}</p>
        <p>{photoAttributionHome}</p>
      </main>
    </Layout>
  )
}
