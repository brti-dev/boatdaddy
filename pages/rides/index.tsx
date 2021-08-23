import Link from 'next/link'
import useAPI from 'src/lib/use-api'
import Layout from 'src/components/Layout'

export default function Rides() {
  const [data, error] = useAPI(`/api/rides`)

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
