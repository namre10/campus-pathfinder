import { useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'

export default function FitMapBounds({
  locations = [],
  extraPoints = [],
  selectedLocationId = null,
  selectedHousingId = null,
  cityWide = false,
  maxZoom = 17,
}) {
  const map = useMap()

  useEffect(() => {
    if (selectedLocationId || selectedHousingId) return

    const campusPoints = locations.map(l => ({ lat: l.lat, lng: l.lng }))
    const extra = extraPoints.map(p => ({ lat: p.lat, lng: p.lng }))
    const points = cityWide && extra.length
      ? [...campusPoints, ...extra]
      : campusPoints.length
        ? campusPoints
        : extra

    if (!points.length) return

    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], cityWide ? 14 : 17, { animate: true })
      return
    }

    const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]))
    map.fitBounds(bounds, {
      padding: cityWide ? [56, 56] : [48, 48],
      maxZoom: cityWide ? Math.min(maxZoom, 13) : maxZoom,
      animate: true,
    })
  }, [map, locations, extraPoints, selectedLocationId, selectedHousingId, cityWide, maxZoom])

  return null
}
