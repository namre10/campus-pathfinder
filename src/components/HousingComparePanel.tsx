import React from 'react'
import { Link } from 'react-router-dom'
import type { HousingWithCommute } from '../utils/housing'
import { parseRentRange } from '../utils/housing'

export default function HousingComparePanel({
  items,
  onRemove,
  onClear,
}: {
  items: HousingWithCommute[]
  onRemove: (id: number) => void
  onClear: () => void
}) {
  if (items.length < 2) return null

  const rows: { label: string; values: string[] }[] = [
    { label: 'Rent', values: items.map(h => h.rent) },
    { label: 'Bedrooms', values: items.map(h => h.beds) },
    { label: 'Walk to campus', values: items.map(h => `${h.walkMinutes} min`) },
    { label: 'Bike to campus', values: items.map(h => `${h.bikeMinutes} min`) },
    { label: 'Neighborhood', values: items.map(h => h.neighborhood) },
  ]

  const cheapest = items.reduce((best, h) => {
    const { min } = parseRentRange(h.rent)
    if (min == null) return best
    if (!best || min < best.min) return { id: h.id, min }
    return best
  }, null as { id: number; min: number } | null)

  const closest = items.reduce((best, h) => {
    if (!best || h.walkMinutes < best.walk) return { id: h.id, walk: h.walkMinutes }
    return best
  }, null as { id: number; walk: number } | null)

  return (
    <div className="housing-compare-panel">
      <div className="housing-compare-head">
        <strong>Compare apartments ({items.length}/3)</strong>
        <button type="button" className="btn compact" onClick={onClear}>Clear</button>
      </div>
      <div className="housing-compare-scroll">
        <table className="housing-compare-table">
          <thead>
            <tr>
              <th />
              {items.map(h => (
                <th key={h.id}>
                  <span className="housing-compare-name">{h.name}</span>
                  <button
                    type="button"
                    className="housing-compare-remove"
                    aria-label={`Remove ${h.name}`}
                    onClick={() => onRemove(h.id)}
                  >
                    ✕
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.label}>
                <td className="housing-compare-label">{row.label}</td>
                {row.values.map((val, i) => {
                  const item = items[i]
                  const highlight =
                    (row.label === 'Rent' && cheapest?.id === item.id) ||
                    (row.label === 'Walk to campus' && closest?.id === item.id)
                  return (
                    <td key={item.id} className={highlight ? 'housing-compare-best' : undefined}>
                      {val}
                      {highlight && row.label === 'Rent' && cheapest && ' ★'}
                      {highlight && row.label === 'Walk to campus' && ' ★'}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="housing-compare-links">
        {items.map(h => (
          <Link key={h.id} to={`/housing/${h.id}`} className="btn compact">
            {h.name} →
          </Link>
        ))}
      </div>
    </div>
  )
}
