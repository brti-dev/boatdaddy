import { useRouter } from 'next/router'

import useApi from '@/lib/use-api'
import Layout from '@/components/Layout'
import Loading from '@/components/Loading'

function Profile() {
  const { query } = useRouter()
  console.log(query)

  const username = query?.username?.slice(1)

  const [profile, error] = useApi(`/api/profile/${username}`)

  if (error) {
    console.error(error)

    return (
      <Layout>
        <h1>Oops</h1>
        <p>{error.message ?? 'Something went wrong'}</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <main>
        <h1>{username}</h1>
        <div>
          {profile ? (
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          ) : (
            <Loading />
          )}
        </div>
      </main>
    </Layout>
  )
}

export default Profile
