import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react'

const DirectionsControl = forwardRef(function DirectionsControl(
  { locations = [], onRequestRoute, onClearRoute, routeActive = false, pickMode, onPickModeChange },
  ref
) {
  const [open, setOpen] = useState(false)
  const [originCoords, setOriginCoords] = useState('')
  const [destinationId, setDestinationId] = useState('')
  const [accessible, setAccessible] = useState(false)
  const envKey = import.meta.env.VITE_ORS_API_KEY || ''
  const [apiKey, setApiKey] = useState(envKey || localStorage.getItem('ors_api_key') || '')
  const [status, setStatus] = useState('')

  useImperativeHandle(ref, () => ({
    setDestination(id) {
      setDestinationId(String(id))
      setOpen(true)
      setStatus('')
    },
    setOrigin(coords) {
      setOriginCoords(coords)
      setOpen(true)
      setStatus('Origin set from map.')
    },
    openPanel() {
      setOpen(true)
    },
  }))

  useEffect(() => {
    if (!envKey) localStorage.setItem('ors_api_key', apiKey)
  }, [apiKey, envKey])

  async function useCurrentLocation() {
    setStatus('Requesting location...')
    try {
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true })
      )
      setOriginCoords(`${pos.coords.latitude},${pos.coords.longitude}`)
      setStatus('Current location set.')
    } catch (err) {
      setStatus('Could not get location. Allow GPS access or enter coordinates manually.')
    }
  }

  function parseCoords(text) {
    const [lat, lng] = text.split(',').map(s => Number(s.trim()))
    if (!isFinite(lat) || !isFinite(lng)) return null
    return { lat, lng }
  }

  function swapPoints() {
    const dest = locations.find(l => String(l.id) === String(destinationId))
    if (dest && originCoords) {
      setOriginCoords(`${dest.lat},${dest.lng}`)
      // Try to find if origin coords match a location for reverse swap
      const origin = parseCoords(originCoords)
      if (origin) {
        const nearest = locations.find(l =>
          Math.abs(l.lat - origin.lat) < 0.0001 && Math.abs(l.lng - origin.lng) < 0.0001
        )
        if (nearest) setDestinationId(String(nearest.id))
      }
    }
  }

  function handleClear() {
    setStatus('')
    onClearRoute?.()
  }

  async function handleRequest(e) {
    e.preventDefault()
    const dest = locations.find(l => String(l.id) === String(destinationId))
    if (!dest) { setStatus('Select a destination from the list or pick one on the map.'); return }

    const origin = parseCoords(originCoords)
    if (!origin) { setStatus('Set your starting point using GPS or enter lat,lng.'); return }

    if (!apiKey && !envKey) {
      setStatus('Add an OpenRouteService API key under Advanced settings.')
      return
    }

    await onRequestRoute({
      origin,
      destination: { lat: dest.lat, lng: dest.lng, name: dest.name, id: dest.id },
      accessible,
      apiKey: envKey || apiKey,
      setStatus,
    })
  }

  const destLocation = locations.find(l => String(l.id) === String(destinationId))

  return (
    <div className="control-panel">
      <button type="button" className="directions-toggle" onClick={() => setOpen(o => !o)}>
        <span>
          Get directions
          {destLocation && !open && <span className="directions-dest-preview"> → {destLocation.name}</span>}
          {routeActive && !open && <span className="directions-route-badge"> Route active</span>}
        </span>
        <span aria-hidden="true">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="directions-body">
          <form onSubmit={handleRequest} className="control-form">
            <div className="control-group">
              <label className="control-label" htmlFor="origin-coords">From</label>
              <div className="control-row">
                <input
                  id="origin-coords"
                  className="control-input"
                  value={originCoords}
                  onChange={e => setOriginCoords(e.target.value)}
                  placeholder="lat,lng"
                />
                <button type="button" className="btn" onClick={useCurrentLocation}>GPS</button>
                <button
                  type="button"
                  className={`btn${pickMode === 'origin' ? ' primary' : ''}`}
                  onClick={() => onPickModeChange?.(pickMode === 'origin' ? null : 'origin')}
                >
                  Pick
                </button>
              </div>
            </div>

            <div className="control-group">
              <label className="control-label" htmlFor="dest-select">To</label>
              <div className="control-row">
                <select
                  id="dest-select"
                  className="control-input"
                  value={destinationId}
                  onChange={e => setDestinationId(e.target.value)}
                  style={{ flex: 1 }}
                >
                  <option value="">Select destination</option>
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>{l.name} · {l.category}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className={`btn${pickMode === 'destination' ? ' primary' : ''}`}
                  onClick={() => onPickModeChange?.(pickMode === 'destination' ? null : 'destination')}
                >
                  Pick
                </button>
              </div>
            </div>

            <div className="control-group control-compact">
              <button type="button" className="btn" onClick={swapPoints} title="Swap from and to">⇅ Swap</button>
            </div>

            <div className="control-group control-compact">
              <span className="control-label">Options</span>
              <div className="checkbox-row">
                <input
                  type="checkbox"
                  id="accessible-route"
                  checked={accessible}
                  onChange={e => setAccessible(e.target.checked)}
                />
                <label htmlFor="accessible-route">Wheelchair-friendly</label>
              </div>
            </div>

            <div className="control-group control-submit">
              <button className="btn primary control-submit-btn" type="submit">Get directions</button>
              {routeActive && (
                <button type="button" className="btn" onClick={handleClear}>Clear route</button>
              )}
              <div className={`control-status${status.includes('error') || status.includes('Add an') ? ' control-status--error' : ''}`}>
                {status}
              </div>
            </div>

            {!envKey && (
              <details className="control-advanced">
                <summary>Advanced: routing API key</summary>
                <div className="control-group" style={{ marginTop: 10 }}>
                  <label className="control-label" htmlFor="ors-key">OpenRouteService API key</label>
                  <input
                    id="ors-key"
                    className="control-input"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="Get a free key at openrouteservice.org"
                  />
                </div>
              </details>
            )}
          </form>
        </div>
      )}
    </div>
  )
})

export default DirectionsControl
