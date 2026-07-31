import React from 'react'

export default function RouteInstructions({ summary, steps = [], onClear }) {
  if (!summary && (!steps || steps.length === 0)) return null
  return (
    <div className="route-panel">
      <div className="route-panel-header">
        <strong>Route directions</strong>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {summary && (
            <span className="route-panel-summary">
              {(summary.distance / 1000).toFixed(2)} km · {Math.round(summary.duration / 60)} min
            </span>
          )}
          {onClear && (
            <button type="button" className="btn compact" onClick={onClear}>Clear</button>
          )}
        </div>
      </div>
      <ol className="route-steps">
        {steps.map((s, i) => (
          <li key={i} className="route-step">
            <div dangerouslySetInnerHTML={{ __html: s.instruction || s.name || s.description || 'Proceed' }} />
            <div className="route-step-meta">
              {(s.distance / 1).toFixed(0)} m · {Math.round((s.duration || 0) / 60)} min
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
