import React from 'react'
import { Link } from 'react-router-dom'

export default function EmptyState({ icon = '📭', title, description, actions }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {actions && <div className="empty-state-actions">{actions}</div>}
    </div>
  )
}

export function EmptyStateLink({ to, children, primary = false }) {
  return <Link to={to} className={primary ? 'btn primary' : 'btn'}>{children}</Link>
}
