import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export default function DashboardSection({
  title,
  viewAllTo,
  viewAllLabel = 'View all',
  children,
}: {
  title: string
  viewAllTo?: string
  viewAllLabel?: string
  children: ReactNode
}) {
  return (
    <section className="dashboard-section">
      <div className="dashboard-section-header">
        <h3>{title}</h3>
        {viewAllTo && (
          <Link to={viewAllTo} className="dashboard-section-link">{viewAllLabel}</Link>
        )}
      </div>
      {children}
    </section>
  )
}
