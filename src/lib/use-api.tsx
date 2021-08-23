import useSWR from 'swr'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }

  return data
}

export default function useAPI(url: string) {
  const { data, error } = useSWR(url, fetcher)

  return [data, error]
}
