import { useRef, useState, useEffect } from 'react'
import { getBoundsOfDistance } from 'geolib'
import ReactMap, { Marker, NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import useMediaQuery from 'lib/use-media-query'
import useDebounce from 'lib/use-debounce'

const DEFAULT_LAT = 41.49
const DEFAULT_LONG = -73.45
const MAPBOX_API_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN

export type BoundsArray = number[][]

export type ViewportState = {
  latitude: number
  longitude: number
  zoom: number
  bounds: BoundsArray
}

export interface MapProps {
  latitude?: number
  longitude?: number
  zoom?: number
  includeNavigationControls?: boolean
  style?: React.CSSProperties
  onMove?: (newState: ViewportState) => void
  onChange?: (viewport: ViewportState) => void
  children?: React.ReactChild | React.ReactChild[]
}

const isFlux = state =>
  state.inTransition ||
  state.isDragging ||
  state.isPanning ||
  state.isRotating ||
  state.isZooming

export default function Map(props: MapProps) {
  const {
    latitude,
    longitude,
    zoom,
    includeNavigationControls = true,
    style,
    onMove = _ => {},
    onChange = _ => {},
    children,
  } = props

  if (!MAPBOX_API_TOKEN) {
    console.log('No Mapbox token found in env')

    return <strong>Something went wrong :(</strong>
  }

  const viewportVars = {
    latitude: latitude ?? DEFAULT_LAT,
    longitude: longitude ?? DEFAULT_LONG,
    zoom: zoom ?? 13,
  }

  const mapRef = useRef(null)
  const [viewport, setViewport] = useState(viewportVars)
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [bounds, setBounds] = useState<BoundsArray>(null)
  const boundsDebounced = useDebounce(bounds, 200)

  // Only report debounced data to the onChange callback
  useEffect(() => {
    console.log('bounds (deb) effect', boundsDebounced)
    if (!bounds) {
      return
    }

    const { latitude, longitude, zoom } = viewport
    onChange({ latitude, longitude, zoom, bounds: boundsDebounced })
  }, [boundsDebounced])

  return (
    <ReactMap
      latitude={viewport.latitude}
      longitude={viewport.longitude}
      zoom={viewport.zoom}
      width="100%"
      height="100%"
      onLoad={() => {
        if (mapRef.current) {
          const bounds = mapRef.current.getMap().getBounds().toArray()
          setBounds(bounds)
        }
      }}
      onViewportChange={viewport => {
        setViewport(viewport)
      }}
      onInteractionStateChange={state => {
        onMove({ ...state, ...viewport })

        const bounds = mapRef.current.getMap().getBounds().toArray()
        setBounds(bounds)
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
      style={style}
    >
      {includeNavigationControls && (
        <div style={{ position: 'absolute', right: 45, bottom: 100 }}>
          <NavigationControl showCompass={false} />
        </div>
      )}
      {children}
    </ReactMap>
  )
}

export { Marker as MapMarker }

// function SingleMapMarker({ latitude, longitude }: Position) {
//   return (
//     <>
//       <div className="absolute top-0 left-0 p-4">
//         <NavigationControl showCompass={false} />
//       </div>

//       <Marker
//         latitude={userPosition.latitude}
//         longitude={userPosition.longitude}
//         offsetLeft={-15}
//         offsetTop={-15}
//       >
//         👨
//       </Marker>
//     </>
//   )
// }

// function MultiMapMarker({ nearby }: { nearby: UserPosition[] }) {
//   return (
//     <>
//       {nearby.map(driver => (
//         <Marker
//           key={driver.id}
//           latitude={driver.latitude}
//           longitude={driver.longitude}
//           offsetLeft={-15}
//           offsetTop={-15}
//         >
//           🛥️
//         </Marker>
//       ))}
//     </>
//   )
// }
