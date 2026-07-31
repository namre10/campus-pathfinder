import React from 'react'
import { Link } from 'react-router-dom'
import type { DashboardAgendaItem } from '../../utils/dashboard'

export default function DashboardNextUp({
  items,
  onViewMap,
}: {
  items: DashboardAgendaItem[]
  onViewMap?: (locationId: number) => void
}) {
  if (items.length === 0) return null

  return (
    <div className="dashboard-next-up">
      {items.map(item => (
        <div key={item.id} className="dashboard-next-up-item">
          <div className="dashboard-next-up-main">
            <span className={`dashboard-badge dashboard-badge--${item.type}`}>{item.badge}</span>
            <Link to={item.link} className="dashboard-next-up-title">{item.title}</Link>
            <div className="meta">{item.subtitle}</div>
            <div className="meta">{item.time}</div>
          </div>
          <div className="dashboard-next-up-actions">
            <Link to={item.link} className="btn">Open</Link>
            {item.locationId && onViewMap && (
              <button type="button" className="btn" onClick={() => onViewMap(item.locationId!)}>
                Map
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
