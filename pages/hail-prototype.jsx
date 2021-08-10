import { useRef, useEffect } from 'react'

export default function Hail() {
    const daddyRef = useRef(null)

    useEffect(() => {
        daddyRef.current.style.transform = 'translate(-100px, 30vh)'
    }, [])

    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                maxWidth: 772,
                maxHeight: 792,
                position: 'relative',
            }}
        >
            <img
                src="/img/map.png"
                alt="map"
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
            <div
                style={{
                    position: 'absolute',
                    top: '49%',
                    left: '42%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                📍
            </div>
            <div
                ref={daddyRef}
                style={{
                    position: 'absolute',
                    top: '5%',
                    left: '55%',
                    transition: 'transform 44s ease',
                }}
            >
                👨
            </div>
        </div>
    )
}
