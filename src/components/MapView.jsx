import React, { useEffect } from 'react'
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import MarkerClusterGroup from './MarkerClusterGroup'
import EventMarkerGroup from './EventMarkerGroup'
import HousingMarkerGroup from './HousingMarkerGroup'
import MapLegend from './MapLegend'
import FitMapBounds from './FitMapBounds'
import { COLUMBIA_CENTER } from '../utils/housing'

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
  housing = [],
  allLocations = [],
  center = [COLUMBIA_CENTER.lat, COLUMBIA_CENTER.lng],
  defaultZoom = 13,
  mapRef,
  onMarkerClick,
  onEventClick,
  onHousingClick,
  routeGeojson,
  selectedLocationId = null,
  selectedHousingId = null,
  showEvents = true,
  showHousing = true,
  onToggleEvents,
  onToggleHousing,
  pickMode = null,
  onPickLocation,
  onCancelPick,
  locationDetailOpen = false,
  housingDetailOpen = false,
}) {
  const eventCount = events.filter(ev => allLocations.some(l => l.id === ev.locationId)).length
  const detailOpen = locationDetailOpen || housingDetailOpen

  return (
    <main className={`map${pickMode ? ' map--pick-mode' : ''}${detailOpen ? ' map--detail-open' : ''}`}>
      <MapContainer
        center={center}
        zoom={showHousing ? defaultZoom : 16}
        className="map-container"
        style={{ height: '100%', width: '100%' }}
      >
        <MapRefSetter mapRef={mapRef} />
        <MapResizeHandler />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitMapBounds
          locations={locations}
          extraPoints={showHousing ? housing : []}
          selectedLocationId={selectedLocationId}
          selectedHousingId={selectedHousingId}
          cityWide={showHousing}
          maxZoom={showHousing ? 13 : 17}
        />
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
        <HousingMarkerGroup
          housing={housing}
          onHousingClick={onHousingClick}
          selectedHousingId={selectedHousingId}
          visible={showHousing}
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
        showHousing={showHousing}
        locationCount={locations.length}
        eventCount={eventCount}
        housingCount={housing.length}
      />
      {!detailOpen && (
        <div className="map-controls">
          <button
            type="button"
            className={`map-control-btn${showHousing ? ' active' : ''}`}
            onClick={onToggleHousing}
            title={showHousing ? 'Hide Columbia housing' : 'Show Columbia housing'}
          >
            🏠 Columbia
          </button>
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
