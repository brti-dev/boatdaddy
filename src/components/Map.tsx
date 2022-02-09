import { useRef, useState } from 'react'
import { getBoundsOfDistance } from 'geolib'
import ReactMapGL, { Marker, NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import useMediaQuery from 'src/lib/use-media-query'
import ErrorPage from './ErrorPage'
import { useUser } from 'src/context/user-context'

const MAPBOX_API_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN

interface UserPosition {
  id: number
  latitude: number
  longitude: number
}

interface MapProps {
  // Position of a single user, map focuses on location
  userPosition?: UserPosition
  // Positions of available drivers within the bounds of a location on a map
  nearby?: UserPosition[]
  // Callback when user changes to map state finish
  onChange?: Function
}

const isFlux = state =>
  state.inTransition ||
  state.isDragging ||
  state.isPanning ||
  state.isRotating ||
  state.isZooming

function SingleMap({ userPosition }: { userPosition: UserPosition }) {
  return (
    <>
      <div className="absolute top-0 left-0 p-4">
        <NavigationControl showCompass={false} />
      </div>

      <Marker
        latitude={userPosition.latitude}
        longitude={userPosition.longitude}
        offsetLeft={-15}
        offsetTop={-15}
      >
        👨
      </Marker>
    </>
  )
}

function MultiMap({ nearby }: { nearby: UserPosition[] }) {
  return (
    <>
      {nearby.map(driver => (
        <Marker
          key={driver.id}
          latitude={driver.latitude}
          longitude={driver.longitude}
          offsetLeft={-15}
          offsetTop={-15}
        >
          🛥️
        </Marker>
      ))}
    </>
  )
}

export default function Map(props: MapProps) {
  const user = useUser()
  const { userPosition, nearby, onChange = () => {} } = props

  if (!MAPBOX_API_TOKEN) {
    console.log('No Mapbox token found in env')

    return <ErrorPage />
  }

  const mapRef = useRef(null)
  const [viewport, setViewport] = useState({
    latitude: userPosition?.latitude ?? user.data.latitude,
    longitude: userPosition?.longitude ?? user.data.longitude,
    zoom: 13,
  })
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="100%"
      onViewportChange={viewport => {
        setViewport(viewport)
      }}
      onInteractionStateChange={state => {
        if (!isFlux(state)) {
          // console.log('Change', viewport)
          onChange(viewport)
        }
      }}
      mapboxApiAccessToken={MAPBOX_API_TOKEN}
      ref={instance => (mapRef.current = instance)}
      minZoom={8}
      maxZoom={13}
      mapStyle={
        isDarkMode
          ? 'mapbox://styles/leighhalliday/ckhjaksxg0x2v19s1ovps41ef'
          : undefined
      }
    >
      {userPosition && <SingleMap userPosition={userPosition} />}
      {nearby && <MultiMap nearby={nearby} />}
    </ReactMapGL>
  )
}
