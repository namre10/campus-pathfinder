import React from 'react'

export default function MapPlaceholder({ highlighted }){
  return (
    <main className="map">
      <div className="map-top">Map — University of Missouri (placeholder)</div>
      <div className="map-canvas">
        <div className="map-pin">📍</div>
        {highlighted && (
          <div className="map-info">
            <strong>{highlighted.name}</strong>
            <div>{highlighted.category} · {highlighted.rating} ★</div>
          </div>
        )}
      </div>
    </main>
  )
}
