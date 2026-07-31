import { useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet.markercluster'
import { createEventIcon, buildEventPopupHtml } from '../utils/mapIcons'

export default function EventMarkerGroup({
  events = [],
  locations = [],
  onEventClick,
  visible = true,
}) {
  const map = useMap()

  useEffect(() => {
    if (!visible) return undefined

    const clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 40,
    })
    const icon = createEventIcon()

    events.forEach(ev => {
      const loc = locations.find(l => l.id === ev.locationId)
      if (!loc) return

      const marker = L.marker([loc.lat, loc.lng], { icon, zIndexOffset: 500 })
      marker.bindPopup(buildEventPopupHtml(ev, loc.name), { maxWidth: 260, className: 'cp-popup' })

      marker.on('popupopen', (e) => {
        const el = e.popup.getElement()?.querySelector('[data-action="event"]')
        if (el) {
          el.onclick = (ev2) => {
            ev2.preventDefault()
            onEventClick?.(ev)
          }
        }
      })

      marker.on('click', () => onEventClick?.(ev))
      clusterGroup.addLayer(marker)
    })

    map.addLayer(clusterGroup)
    return () => map.removeLayer(clusterGroup)
  }, [map, events, locations, onEventClick, visible])

  return null
}
