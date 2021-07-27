import Link from 'next/link'
import { useRouter } from 'next/router'

import useAPI from '@/lib/use-api'
import Layout from '@/components/Layout'

export default function Ride() {
  const { query } = useRouter()
  const id = query.id

  const [data, error] = useAPI(`/api/rides/${id}`)

  if (error) return <div>{error.message}</div>
  if (!data) return <div>Loading...</div>

  return <Layout>{JSON.stringify(data)}</Layout>
}
