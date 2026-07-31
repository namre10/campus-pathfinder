import { useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'

export default function FitMapBounds({ locations = [], selectedLocationId = null }) {
  const map = useMap()

  useEffect(() => {
    if (selectedLocationId) return
    if (!locations.length) return
    if (locations.length === 1) {
      map.setView([locations[0].lat, locations[0].lng], 17, { animate: true })
      return
    }
    const bounds = L.latLngBounds(locations.map(l => [l.lat, l.lng]))
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 17, animate: true })
  }, [map, locations, selectedLocationId])

  return null
}
