import Link from 'next/link'
import useSWR from 'swr'
import Layout from '@/components/Layout'

const fetcher = async url => {
  const res = await fetch(url)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }

  return data
}

export default function Rides() {
  const { data, error } = useSWR(`/api/rides`, fetcher)

  if (error) return <div>{error.message ?? 'Something went wrong'}</div>
  if (!data) return <div>Loading...</div>

  return (
    <Layout title="Your Rides with Boat Daddy">
      <ul>
        {data.map(ride => (
          <li key={ride.id}>
            <Link href={`/rides/${ride.id}`}>{ride.startedAt}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}
