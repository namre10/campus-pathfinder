import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { createLocationIcon } from '../../utils/mapIcons'

function MapResizer() {
  const map = useMap()
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 100)
    return () => clearTimeout(t)
  }, [map])
  return null
}

export default function EventMiniMap({
  lat,
  lng,
  category = 'Services',
  name,
}: {
  lat: number
  lng: number
  category?: string
  name: string
}) {
  return (
    <div className="event-mini-map">
      <MapContainer
        center={[lat, lng]}
        zoom={17}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <MapResizer />
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={createLocationIcon(category)} />
      </MapContainer>
      <div className="event-mini-map-label">{name}</div>
    </div>
  )
}
