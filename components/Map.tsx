import { useRef, useState } from 'react'
import ReactMapGL from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import useMediaQuery from '@/lib/use-media-query'

export default function Map() {
  const mapRef = useRef(null)
  const [viewport, setViewport] = useState({
    latitude: 41.49,
    longitude: -73.45,
    zoom: 13,
  })
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="100%"
      onViewportChange={viewport => setViewport(viewport)}
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
      ref={instance => (mapRef.current = instance)}
      minZoom={5}
      maxZoom={13}
      mapStyle={
        isDarkMode
          ? 'mapbox://styles/leighhalliday/ckhjaksxg0x2v19s1ovps41ef'
          : undefined
      }
    />
  )
}
