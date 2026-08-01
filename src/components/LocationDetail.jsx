import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ContributionForm from './ContributionForm'
import { getCategoryConfig } from '../utils/mapIcons'
import { findNearby, formatDistance } from '../utils/geo'

export default function LocationDetail({
  locations = [],
  tips = [],
  addTip,
  favorites = new Set(),
  toggleFavorite,
  overlay = false,
  onGetDirections,
  onSelectLocation,
}) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const loc = locations.find(l => String(l.id) === String(id))
  if (!loc) return null

  const cfg = getCategoryConfig(loc.category)
  const moderatedTips = tips.filter(t => t.locationId === loc.id && t.isModerated)
  const pendingTips = tips.filter(t => t.locationId === loc.id && !t.isModerated)
  const nearby = findNearby(loc, locations, 3)

  async function shareLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const content = (
    <>
      {overlay && (
        <div className="location-overlay-close">
          <button type="button" className="btn" onClick={() => navigate('/map')}>✕ Close</button>
        </div>
      )}

      <div className="location-hero" style={{ background: `linear-gradient(135deg, ${cfg.color}22, ${cfg.color}44)` }}>
        <span className="location-hero-icon">{cfg.emoji}</span>
        <div>
          <div className="location-hero-category">{loc.category}</div>
          <h2 className="location-hero-title">{loc.name}</h2>
          <div className="meta">{loc.rating} ★ · {loc.hours || 'Hours N/A'}</div>
        </div>
      </div>

      <div className="page-actions location-quick-actions">
        <button
          type="button"
          className={`btn${favorites.has(loc.id) ? ' primary' : ''}`}
          onClick={() => toggleFavorite(loc.id)}
        >
          {favorites.has(loc.id) ? '★ Saved' : '☆ Save'}
        </button>
        <button type="button" className="btn primary" onClick={() => onGetDirections?.(loc.id)}>
          Get directions
        </button>
        <button type="button" className="btn" onClick={shareLink}>
          {copied ? 'Link copied!' : 'Share'}
        </button>
      </div>

      <div className="section-panel">
        <p>{loc.description || 'A campus location at the University of Missouri.'}</p>
        <div className="label-group">
          {loc.tags.map(t => <span key={t} className="label-chip">{t}</span>)}
        </div>
      </div>

      {nearby.length > 0 && (
        <div className="section-panel">
          <h3>Nearby</h3>
          {nearby.map(({ location: near, distance }) => (
            <button
              key={near.id}
              type="button"
              className="nearby-item"
              onClick={() => onSelectLocation?.(near)}
            >
              <span>{near.name}</span>
              <span className="meta">{formatDistance(distance)} · {near.category}</span>
            </button>
          ))}
        </div>
      )}

      <section className="section-panel">
        <h3>Student tips</h3>
        {moderatedTips.length === 0 && pendingTips.length === 0 && (
          <div className="empty">No tips yet. Be the first to add one!</div>
        )}
        {moderatedTips.map(t => (
          <div key={t.id} className="meeting-card" style={{ marginBottom: 10 }}>
            <div>{t.text}</div>
            <div className="meta">{t.rating} ★ — {t.tags.join(', ')} — {new Date(t.createdAt).toLocaleString()}</div>
          </div>
        ))}
        {pendingTips.length > 0 && (
          <div className="meta" style={{ marginBottom: 10 }}>
            You have {pendingTips.length} tip{pendingTips.length > 1 ? 's' : ''} pending moderation.
          </div>
        )}
        <h4 style={{ marginTop: 12, marginBottom: 0 }}>Add a tip</h4>
        <ContributionForm locationId={loc.id} onSubmit={addTip} />
      </section>
    </>
  )

  if (overlay) {
    return <div className="location-overlay location-overlay--animated">{content}</div>
  }

  return (
    <div className="page-panel">
      <div className="content-panel">{content}</div>
    </div>
  )
}
