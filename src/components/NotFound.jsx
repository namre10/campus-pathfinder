import React from 'react'
import { Link } from 'react-router-dom'
import PageHeading from './PageHeading'

export default function NotFound() {
  return (
    <div className="page-panel">
      <div className="content-panel">
        <PageHeading
          title="Page not found"
          description="The page you're looking for doesn't exist or may have moved."
          breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Not found' }]}
          actions={
            <>
              <Link to="/" className="btn primary">Back to map</Link>
              <Link to="/dashboard" className="btn">Dashboard</Link>
            </>
          }
        />
      </div>
    </div>
  )
}
