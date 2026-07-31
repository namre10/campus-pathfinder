import { useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet.markercluster'
import {
  createLocationIcon,
  buildLocationPopupHtml,
} from '../utils/mapIcons'

export default function MarkerClusterGroup({
  locations = [],
  selectedLocationId = null,
  onMarkerClick,
  pickMode = null,
  onPickLocation,
}) {
  const map = useMap()

  useEffect(() => {
    const clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
    })

    locations.forEach(loc => {
      const selected = loc.id === selectedLocationId
      const marker = L.marker([loc.lat, loc.lng], {
        icon: createLocationIcon(loc.category, { selected }),
        zIndexOffset: selected ? 1000 : 0,
      })

      marker.bindPopup(buildLocationPopupHtml(loc), { maxWidth: 260, className: 'cp-popup' })

      marker.on('popupopen', (e) => {
        const el = e.popup.getElement()?.querySelector('[data-action="details"]')
        if (el) {
          el.onclick = (ev) => {
            ev.preventDefault()
            onMarkerClick?.(loc)
          }
        }
      })

      marker.on('click', () => {
        if (pickMode === 'destination' || pickMode === 'origin') {
          onPickLocation?.(loc, pickMode)
          return
        }
        onMarkerClick?.(loc)
      })

      clusterGroup.addLayer(marker)
    })

    map.addLayer(clusterGroup)
    return () => map.removeLayer(clusterGroup)
  }, [map, locations, selectedLocationId, onMarkerClick, pickMode, onPickLocation])

  return null
}
