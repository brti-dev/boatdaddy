import Head from 'next/head'

import Layout from 'components/Layout'
import { useAuth } from 'context/auth-context'

export default function Home() {
  const auth = useAuth()

  return (
    <Layout>
      <Head>
        <title>Boat Daddy - Log In</title>
      </Head>
      <main>
        {auth.data ? (
          <>
            <h1>Hello, Daddy</h1>
            <p>You are already signed in.</p>
          </>
        ) : (
          <p>Please sign in to continue.</p>
        )}
      </main>
    </Layout>
  )
}
