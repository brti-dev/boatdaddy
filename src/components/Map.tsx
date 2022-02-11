import { useRef, useState, useEffect } from 'react'
import { getBoundsOfDistance } from 'geolib'
import ReactMap, { Marker, NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import useMediaQuery from 'src/lib/use-media-query'

const DEFAULT_LAT = 41.49
const DEFAULT_LONG = -73.45

const MAPBOX_API_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN

interface MapProps {
  latitude?: number
  longitude?: number
  zoom?: number
  includeNavigationControls?: boolean
  style?: React.CSSProperties
  onMove?: Function
  onChange?: Function
  children?: React.ReactElement | React.ReactElement[]
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

  // To avoid reporting changes when zooming/panning, only return changes after
  // a short interval
  const [mapState, setMapState] = useState(null)
  const timerRef = useRef(null)
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => onChange(mapState), 400)
    return () => clearTimeout(timerRef.current)
  }, [mapState])

  return (
    <ReactMap
      {...viewport}
      width="100%"
      height="100%"
      onViewportChange={viewport => {
        setViewport(viewport)
      }}
      onInteractionStateChange={state => {
        console.log('onInteractionStateChange', state)
        onMove({ ...state, ...viewport })

        if (!isFlux(state)) {
          setMapState(viewport)
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

export { Marker }

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
