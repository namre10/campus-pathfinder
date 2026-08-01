import { useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet.markercluster'
import { createHousingIcon, buildHousingPopupHtml } from '../utils/mapIcons'

export default function HousingMarkerGroup({
  housing = [],
  onHousingClick,
  selectedHousingId = null,
  visible = true,
}) {
  const map = useMap()

  useEffect(() => {
    if (!visible) return undefined

    const clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
    })

    housing.forEach(item => {
      const selected = selectedHousingId === item.id
      const icon = createHousingIcon({ selected })
      const marker = L.marker([item.lat, item.lng], {
        icon,
        zIndexOffset: selected ? 800 : 600,
      })

      marker.bindPopup(buildHousingPopupHtml(item), { maxWidth: 280, className: 'cp-popup' })

      marker.on('popupopen', (e) => {
        const el = e.popup.getElement()?.querySelector('[data-action="housing-details"]')
        if (el) {
          el.onclick = (ev) => {
            ev.preventDefault()
            onHousingClick?.(item)
          }
        }
      })

      marker.on('click', () => onHousingClick?.(item))
      clusterGroup.addLayer(marker)
    })

    map.addLayer(clusterGroup)
    return () => map.removeLayer(clusterGroup)
  }, [map, housing, onHousingClick, selectedHousingId, visible])

  return null
}
