import Head from 'next/head'
import Image from 'next/image'

import Layout from '@/components/Layout'
import classes from '@/styles/index.module.scss'
import Button from '@/components/Button'

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
                <p>
                    <strong>Boat Daddy</strong> is the premier boat hailing app
                    that connects you to boats and daddies nearby right now.
                </p>
                <div className={classes.hero}>
                    <Button to="/hail" variant="contained" color="secondary">
                        Hail a Boat Daddy
                    </Button>
                    <img
                        src="/img/hero_redshortsdaddy.jpg"
                        alt="Boat daddy in red shorts"
                    />
                </div>
            </main>
        </Layout>
    )
}
