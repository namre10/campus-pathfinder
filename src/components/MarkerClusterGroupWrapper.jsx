import { useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet.markercluster'

export default function MarkerClusterGroupWrapper({ children, options }){
  const map = useMap()

  useEffect(() => {
    const markers = L.markerClusterGroup(options)
    // create a layer group of marker elements in children
    // children are Marker components, react-leaflet will also render them — instead, we will append markers manually
    // To keep things simple, rely on standard Marker components and do not duplicate; this wrapper will add clustering by re-creating markers from children props
    // Here we expect children to be an array of objects with position and popup content passed via options.generatedMarkers
    if(options && options.generatedMarkers && Array.isArray(options.generatedMarkers)){
      options.generatedMarkers.forEach(m => {
        const marker = L.marker([m.lat, m.lng])
        if(m.popup) marker.bindPopup(m.popup)
        markers.addLayer(marker)
      })
    }
    map.addLayer(markers)
    return () => {
      map.removeLayer(markers)
    }
  }, [map, options])

  return null
}
