import React, { useEffect } from 'react'
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import MarkerClusterGroup from './MarkerClusterGroup'
import EventMarkerGroup from './EventMarkerGroup'
import MapLegend from './MapLegend'
import FitMapBounds from './FitMapBounds'

function MapRefSetter({ mapRef }) {
  const map = useMap()
  useEffect(() => { if (mapRef) mapRef.current = map }, [map, mapRef])
  return null
}

function MapResizeHandler() {
  const map = useMap()
  useEffect(() => {
    const fix = () => { map.invalidateSize({ animate: false }) }
    fix()
    const t1 = setTimeout(fix, 100)
    const t2 = setTimeout(fix, 400)
    const ro = new ResizeObserver(fix)
    const el = map.getContainer()?.parentElement
    if (el) ro.observe(el)
    window.addEventListener('resize', fix)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      ro.disconnect()
      window.removeEventListener('resize', fix)
    }
  }, [map])
  return null
}

function PickModeBanner({ pickMode, onCancel }) {
  if (!pickMode) return null
  const label = pickMode === 'destination' ? 'destination' : 'origin'
  return (
    <div className="map-pick-banner">
      <span>Click a location on the map to set {label}</span>
      <button type="button" className="btn compact" onClick={onCancel}>Cancel</button>
    </div>
  )
}

export default function MapView({
  locations = [],
  events = [],
  allLocations = [],
  center = [38.944, -92.327],
  mapRef,
  onMarkerClick,
  onEventClick,
  routeGeojson,
  selectedLocationId = null,
  showEvents = true,
  onToggleEvents,
  pickMode = null,
  onPickLocation,
  onCancelPick,
  locationDetailOpen = false,
}) {
  const eventCount = events.filter(ev => allLocations.some(l => l.id === ev.locationId)).length

  return (
    <main className={`map${pickMode ? ' map--pick-mode' : ''}${locationDetailOpen ? ' map--detail-open' : ''}`}>
      <MapContainer
        center={center}
        zoom={16}
        className="map-container"
        style={{ height: '100%', width: '100%' }}
      >
        <MapRefSetter mapRef={mapRef} />
        <MapResizeHandler />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitMapBounds locations={locations} selectedLocationId={selectedLocationId} />
        <MarkerClusterGroup
          locations={locations}
          selectedLocationId={selectedLocationId}
          onMarkerClick={onMarkerClick}
          pickMode={pickMode}
          onPickLocation={onPickLocation}
        />
        <EventMarkerGroup
          events={events}
          locations={allLocations.length ? allLocations : locations}
          onEventClick={onEventClick}
          visible={showEvents}
        />
        {routeGeojson && (
          <GeoJSON
            data={routeGeojson}
            style={{ color: '#1976d2', weight: 5, opacity: 0.9 }}
          />
        )}
      </MapContainer>

      <PickModeBanner pickMode={pickMode} onCancel={onCancelPick} />
      <MapLegend
        showEvents={showEvents}
        locationCount={locations.length}
        eventCount={eventCount}
      />
      {!locationDetailOpen && (
        <div className="map-controls">
          <button
            type="button"
            className={`map-control-btn${showEvents ? ' active' : ''}`}
            onClick={onToggleEvents}
            title={showEvents ? 'Hide events' : 'Show events'}
          >
            🎫 Events
          </button>
        </div>
      )}
    </main>
  )
}
