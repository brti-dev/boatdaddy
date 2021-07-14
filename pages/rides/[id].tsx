import Link from 'next/link'
import { useRouter } from 'next/router'
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

export default function Ride() {
  const {query} = useRouter()
  const id = query.id
  
  const { data, error } = useSWR(`/api/rides/${id}`, fetcher)

  if (error) return <div>{error.message}</div>
  if (!data) return <div>Loading...</div>

  return <Layout>{JSON.stringify(data)}</Layout>
}
