import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import L from 'leaflet'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MapView from './components/MapView'
import LocationDetail from './components/LocationDetail'
import Admin from './components/Admin'
import DirectionsControl from './components/DirectionsControl'
import RouteInstructions from './components/RouteInstructions'
import NotFound from './components/NotFound'

import CareerAdvisingHome from './components/career/CareerAdvisingHome'
import AdvisorDirectory from './components/career/AdvisorDirectory'
import AdvisorProfile from './components/career/AdvisorProfile'
import MyCareerMeetings from './components/career/MyCareerMeetings'

import CommunityHome from './components/community/CommunityHome'
import CommunityDirectory from './components/community/CommunityDirectory'
import CommunityProfile from './components/community/CommunityProfile'
import MyCommunities from './components/community/MyCommunities'
import EventDirectory from './components/events/EventDirectory'
import EventDetail from './components/events/EventDetail'
import Dashboard from './components/Dashboard'
import eventsData from './data/events'
import locationsData from './data/locations.json'

const FAVORITES_KEY = 'campus_pathfinder_favorites'
const TIPS_KEY = 'campus_pathfinder_tips'
const SAVED_EVENTS_KEY = 'campus_pathfinder_saved_events'
const JOINED_COMMUNITIES_KEY = 'campus_pathfinder_joined_communities'

function isMapRoute(pathname) {
  return pathname === '/' || pathname.startsWith('/location/')
}

function isSidebarRoute(pathname) {
  return pathname === '/' || pathname.startsWith('/location/')
}

export default function App() {
  const [locations, setLocations] = useState([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [selectedLocationId, setSelectedLocationId] = useState(null)
  const [favorites, setFavorites] = useState(new Set())
  const [tips, setTips] = useState([])
  const [savedEvents, setSavedEvents] = useState([])
  const [joinedCommunities, setJoinedCommunities] = useState([])
  const [routeGeojson, setRouteGeojson] = useState(null)
  const [routeInfo, setRouteInfo] = useState(null)
  const [routeSteps, setRouteSteps] = useState([])
  const [events] = useState(eventsData)
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 900)
  const [showEvents, setShowEvents] = useState(true)
  const [pickMode, setPickMode] = useState(null)
  const mapRef = useRef(null)
  const directionsRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const onMap = isMapRoute(location.pathname)
  const showSidebar = isSidebarRoute(location.pathname)
  const routeActive = Boolean(routeGeojson)

  useEffect(() => {
    setLocations(locationsData)
    const fav = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
    setFavorites(new Set(fav))
    setTips(JSON.parse(localStorage.getItem(TIPS_KEY) || '[]'))
    const saved = JSON.parse(localStorage.getItem(SAVED_EVENTS_KEY) || '[]')
    setSavedEvents(Array.isArray(saved) ? saved : [])
    const joined = JSON.parse(localStorage.getItem(JOINED_COMMUNITIES_KEY) || '[]')
    setJoinedCommunities(Array.isArray(joined) ? joined : [])
  }, [])

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem(TIPS_KEY, JSON.stringify(tips))
  }, [tips])

  useEffect(() => {
    localStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(savedEvents))
  }, [savedEvents])

  useEffect(() => {
    localStorage.setItem(JOINED_COMMUNITIES_KEY, JSON.stringify(joinedCommunities))
  }, [joinedCommunities])

  useEffect(() => {
    const match = location.pathname.match(/^\/location\/(\d+)/)
    setSelectedLocationId(match ? Number(match[1]) : null)
  }, [location.pathname])

  const filtered = locations.filter(l => {
    const matchesQuery = query.trim() === '' || l.name.toLowerCase().includes(query.toLowerCase()) || l.tags.join(' ').toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'All' || l.category === category
    return matchesQuery && matchesCategory
  })

  const handleSelectLocation = useCallback((loc) => {
    setSelectedLocationId(loc.id)
    if (mapRef.current?.flyTo) {
      mapRef.current.flyTo([loc.lat, loc.lng], 18, { duration: 0.8 })
    }
    navigate(`/location/${loc.id}`)
    setTimeout(() => {
      const el = document.getElementById(`loc-${loc.id}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 300)
  }, [navigate])

  function flyToLocation(locationId) {
    const loc = locations.find(l => l.id === locationId)
    if (loc && mapRef.current?.flyTo) {
      mapRef.current.flyTo([loc.lat, loc.lng], 18, { duration: 0.8 })
    }
    navigate('/')
  }

  function handleGetDirections(locationId) {
    directionsRef.current?.setDestination(locationId)
    setPickMode(null)
  }

  function handlePickLocation(loc, mode) {
    setPickMode(null)
    if (mode === 'destination') {
      directionsRef.current?.setDestination(loc.id)
    } else if (mode === 'origin') {
      directionsRef.current?.setOrigin(`${loc.lat},${loc.lng}`)
    }
  }

  function clearRoute() {
    setRouteGeojson(null)
    setRouteInfo(null)
    setRouteSteps([])
  }

  function toggleFavorite(id) {
    setFavorites(prev => {
      const copy = new Set(prev)
      if (copy.has(id)) copy.delete(id)
      else copy.add(id)
      return copy
    })
  }

  function toggleSavedEvent(id) {
    setSavedEvents(prev => {
      const copy = [...prev]
      const index = copy.indexOf(id)
      if (index !== -1) copy.splice(index, 1)
      else copy.push(id)
      return copy
    })
  }

  function toggleJoinedCommunity(id) {
    setJoinedCommunities(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  function addTip(tip) { setTips(prev => [tip, ...prev]) }
  function updateTip(updated) { setTips(prev => prev.map(t => t.id === updated.id ? updated : t)) }
  function deleteTip(id) { setTips(prev => prev.filter(t => t.id !== id)) }

  async function requestRoute({ origin, destination, accessible, apiKey, setStatus }) {
    try {
      if (!apiKey) {
        setStatus('Add an OpenRouteService API key under Advanced settings.')
        return
      }
      setStatus('Requesting route...')
      const profile = accessible ? 'wheelchair' : 'foot-walking'
      const url = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`
      const normOrigin = [origin.lng || origin.lon || origin.longitude, origin.lat || origin.latitude]
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: apiKey },
        body: JSON.stringify({ coordinates: [normOrigin, [destination.lng, destination.lat]] }),
      })
      if (!resp.ok) {
        const text = await resp.text()
        let msg = `Routing failed (${resp.status}).`
        if (resp.status === 401 || resp.status === 403) msg = 'Invalid API key. Check Advanced settings.'
        else if (resp.status === 429) msg = 'Rate limit reached. Try again in a moment.'
        else if (text) msg += ' ' + text.slice(0, 80)
        setStatus(msg)
        return
      }
      const data = await resp.json()
      setRouteGeojson(data)
      const feat = data?.features?.[0]
      setRouteInfo(feat?.properties?.summary || null)
      setRouteSteps(feat?.properties?.segments?.[0]?.steps || [])
      setStatus(`Route to ${destination.name} ready.`)
      if (mapRef.current && feat?.geometry?.coordinates) {
        try {
          const coords = feat.geometry.coordinates.map(c => [c[1], c[0]])
          const bounds = coords.reduce((b, c) => b ? b.extend(c) : L.latLngBounds(c, c), null)
          mapRef.current.fitBounds(bounds, { padding: [40, 40] })
        } catch (err) { console.warn('Could not fit bounds', err) }
      }
    } catch (err) {
      setStatus('Network error — check your connection and try again.')
    }
  }

  const mapViewProps = {
    locations: filtered,
    allLocations: locations,
    events,
    center: [38.944, -92.327],
    mapRef,
    onMarkerClick: handleSelectLocation,
    onEventClick: ev => navigate(`/events/${ev.id}`),
    routeGeojson,
    selectedLocationId,
    showEvents,
    onToggleEvents: () => setShowEvents(v => !v),
    pickMode,
    onPickLocation: handlePickLocation,
    onCancelPick: () => setPickMode(null),
    locationDetailOpen: location.pathname.startsWith('/location/'),
  }

  return (
    <div className="app-root">
      <Header
        query={query}
        setQuery={setQuery}
        locations={locations}
        onSelect={l => { setQuery(l.name); handleSelectLocation(l) }}
        showSearch={onMap}
      />

      {onMap && (
        <>
          <DirectionsControl
            ref={directionsRef}
            locations={locations}
            onRequestRoute={requestRoute}
            onClearRoute={clearRoute}
            routeActive={routeActive}
            pickMode={pickMode}
            onPickModeChange={setPickMode}
          />
          <RouteInstructions summary={routeInfo} steps={routeSteps} onClear={clearRoute} />
        </>
      )}

      <div className={`main${showSidebar ? '' : ' main--full'}`}>
        {showSidebar && (
          <Sidebar
            locations={filtered}
            category={category}
            setCategory={setCategory}
            onSelect={handleSelectLocation}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            selectedId={selectedLocationId}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        <div className="main-content">
          {showSidebar && (
            <button
              type="button"
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(o => !o)}
            >
              {sidebarOpen ? 'Hide list' : 'Show locations'}
            </button>
          )}

          <div className="route-outlet">
            <Routes>
            <Route path="/" element={
              <div className="map-layout">
                <MapView {...mapViewProps} />
              </div>
            } />
            <Route path="/location/:id" element={
              <div className="map-layout">
                <MapView {...mapViewProps} />
                <LocationDetail
                  overlay
                  locations={locations}
                  tips={tips}
                  addTip={addTip}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  onGetDirections={handleGetDirections}
                  onSelectLocation={handleSelectLocation}
                />
              </div>
            } />

            <Route path="/career" element={<CareerAdvisingHome />} />
            <Route path="/career/directory" element={<AdvisorDirectory />} />
            <Route path="/career/advisor/:id" element={
              <AdvisorProfile onViewLocation={flyToLocation} />
            } />
            <Route path="/career/my-meetings" element={
              <MyCareerMeetings onViewLocation={flyToLocation} />
            } />

            <Route path="/community" element={
              <CommunityHome joinedCommunities={joinedCommunities} />
            } />
            <Route path="/community/directory" element={
              <CommunityDirectory joinedCommunities={joinedCommunities} toggleJoin={toggleJoinedCommunity} />
            } />
            <Route path="/community/my-communities" element={
              <MyCommunities
                joinedCommunities={joinedCommunities}
                toggleJoin={toggleJoinedCommunity}
                onViewLocation={flyToLocation}
              />
            } />
            <Route path="/community/:id" element={
              <CommunityProfile
                joinedCommunities={joinedCommunities}
                toggleJoin={toggleJoinedCommunity}
                onViewLocation={flyToLocation}
              />
            } />

            <Route path="/events" element={
              <EventDirectory events={events} savedEvents={savedEvents} toggleSavedEvent={toggleSavedEvent} />
            } />
            <Route path="/events/:id" element={
              <EventDetail savedEvents={savedEvents} toggleSavedEvent={toggleSavedEvent} onViewMap={flyToLocation} />
            } />

            <Route path="/dashboard" element={
              <Dashboard
                savedEvents={savedEvents}
                joinedCommunities={joinedCommunities}
                favorites={Array.from(favorites)}
                onViewLocation={flyToLocation}
              />
            } />
            <Route path="/admin" element={
              <Admin tips={tips} updateTip={updateTip} deleteTip={deleteTip} locations={locations} />
            } />
            <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>

      <footer className="footer">Campus Pathfinder — University of Missouri (prototype)</footer>
    </div>
  )
}
