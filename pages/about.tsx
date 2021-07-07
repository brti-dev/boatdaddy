import Head from 'next/head'

import Layout from '@/components/Layout'
import classes from '@/styles/index.module.scss'
import Button from '@/components/Button'

export default function Home() {
  return (
    <Layout title="About Boat Daddy">
      <main>
        <h1>About Boat Daddy</h1>
        <p>
          <strong>Boat Daddy</strong> is the premier boat hailing app that
          connects you to boats and daddies nearby right now.
        </p>
        <p>
          Legend has it that the idea for Boat Daddy began in the distant past
          on a fortuitous and glorious summer day on the Candlewood Lake in
          Western Connecticut by the mythical goddesses known only as The Andas.
          While the exact circumstances of its founding idea are a mystery, the
          app was willed into being by co-founder and CEO Maranda Cox in June of
          2021 when she used it to hail her very own Boat Daddy somewhere in the
          Shengsi Islands off the coast of China's Zhejiang Province.
        </p>
      </main>
    </Layout>
  )
}
