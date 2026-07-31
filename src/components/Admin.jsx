import React from 'react'
import { Link } from 'react-router-dom'
import PageHeading from './PageHeading'

export default function Admin({ tips = [], updateTip, deleteTip, locations = [] }) {
  const pending = tips.filter(t => !t.isModerated)
  const moderated = tips.filter(t => t.isModerated)

  return (
    <div className="page-panel">
      <div className="content-panel">
        <PageHeading
          title="Admin — Moderation Queue"
          description="Review and approve student-submitted location tips."
          breadcrumbs={[{ label: 'Map', to: '/' }, { label: 'Admin' }]}
          actions={<Link to="/" className="btn">Back to map</Link>}
        />

        <div className="section-panel">
          <h3>Pending ({pending.length})</h3>
          {pending.length === 0 && <div className="empty">No pending tips.</div>}
          {pending.map(t => (
            <div key={t.id} className="admin-tip-card">
              <div><strong>Location:</strong> {locations.find(l => l.id === t.locationId)?.name || t.locationId}</div>
              <div style={{ marginTop: 6 }}>{t.text}</div>
              <div className="meta">Tags: {t.tags.join(', ')}</div>
              <div className="card-actions">
                <button type="button" className="btn primary" onClick={() => updateTip({ ...t, isModerated: true })}>Approve</button>
                <button type="button" className="btn" onClick={() => deleteTip(t.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="section-panel">
          <h3>Approved ({moderated.length})</h3>
          {moderated.length === 0 && <div className="empty">No approved tips yet.</div>}
          {moderated.map(t => (
            <div key={t.id} className="admin-tip-card">
              <div><strong>Location:</strong> {locations.find(l => l.id === t.locationId)?.name || t.locationId}</div>
              <div style={{ marginTop: 6 }}>{t.text}</div>
              <div className="meta">Tags: {t.tags.join(', ')}</div>
              <div className="card-actions">
                <button type="button" className="btn" onClick={() => deleteTip(t.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
