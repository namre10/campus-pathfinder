import React from 'react'
import { CATEGORY_CONFIG } from '../utils/mapIcons'

export default function MapLegend({
  showEvents = true,
  showHousing = true,
  locationCount = 0,
  eventCount = 0,
  housingCount = 0,
}) {
  const categories = Object.entries(CATEGORY_CONFIG).filter(([k]) => k !== 'default')

  return (
    <div className="map-legend">
      <div className="map-legend-title">Map legend</div>
      <div className="map-legend-items">
        {categories.map(([key, cfg]) => (
          <div key={key} className="map-legend-item">
            <span className="map-legend-dot" style={{ background: cfg.color }}>{cfg.emoji}</span>
            <span>{cfg.label}</span>
          </div>
        ))}
        {showEvents && (
          <div className="map-legend-item">
            <span className="map-legend-dot map-legend-dot--event">🎫</span>
            <span>Event ({eventCount})</span>
          </div>
        )}
        {showHousing && (
          <div className="map-legend-item">
            <span className="map-legend-dot map-legend-dot--housing">🏠</span>
            <span>Housing ({housingCount} across Columbia)</span>
          </div>
        )}
      </div>
      <div className="map-legend-count">{locationCount} campus location{locationCount !== 1 ? 's' : ''} shown</div>
    </div>
  )
}
