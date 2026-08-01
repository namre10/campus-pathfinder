import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CAMPUS_CENTER, googleMapsWalkUrl } from '../utils/housing'
import { formatDistance } from '../utils/geo'

export default function HousingDetail({
  housingList = [],
  overlay = false,
}) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const housing = housingList.find(h => String(h.id) === String(id))
  if (!housing) return null

  const nearbyCampus = formatDistance(housing.walkDistanceKm)
  const walkUrl = googleMapsWalkUrl(housing)

  async function shareLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const walkClass = housing.walkMinutes <= 8
    ? 'housing-commute-pill housing-commute-pill--near'
    : housing.walkMinutes <= 20
      ? 'housing-commute-pill'
      : 'housing-commute-pill housing-commute-pill--far'

  return (
    <>
      {overlay && (
        <div className="location-overlay-close">
          <button type="button" className="btn" onClick={() => navigate('/map')}>✕ Close</button>
        </div>
      )}

      <div className="location-hero housing-hero">
        <span className="location-hero-icon">🏠</span>
        <div>
          <div className="location-hero-category">Columbia · {housing.neighborhood}</div>
          <h2 className="location-hero-title">{housing.name}</h2>
          <div className="meta">{housing.rent} · {housing.beds}</div>
        </div>
      </div>

      <div className="housing-commute-row">
        <span className={walkClass}>🚶 {housing.walkMinutes} min walk to campus</span>
        <span className="housing-commute-pill housing-commute-pill--bike">🚲 {housing.bikeMinutes} min bike</span>
        <span className="housing-commute-pill housing-commute-pill--dist">📍 {nearbyCampus} from {CAMPUS_CENTER.label}</span>
      </div>

      <div className="page-actions location-quick-actions">
        <a
          href={housing.listingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn primary"
        >
          View on offcampus.missouri.edu ↗
        </a>
        <a
          href={walkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
        >
          Walk route to campus ↗
        </a>
        <button type="button" className="btn" onClick={shareLink}>
          {copied ? 'Link copied!' : 'Share'}
        </button>
      </div>

      <div className="section-panel">
        <p>{housing.description}</p>
        <div className="housing-detail-grid">
          <div className="housing-detail-item">
            <span className="housing-detail-label">Neighborhood</span>
            <span>{housing.neighborhood}</span>
          </div>
          <div className="housing-detail-item">
            <span className="housing-detail-label">Address</span>
            <span>{housing.address}</span>
          </div>
          {housing.phone && (
            <div className="housing-detail-item">
              <span className="housing-detail-label">Phone</span>
              <a href={`tel:${housing.phone.replace(/\D/g, '')}`}>{housing.phone}</a>
            </div>
          )}
        </div>
      </div>

      <div className="section-panel">
        <h3>Amenities</h3>
        <div className="label-group">
          {housing.amenities.map(a => (
            <span key={a} className="label-chip">{a}</span>
          ))}
        </div>
      </div>

      <div className="section-panel housing-source-note">
        <p className="meta">
          Listings sourced from Mizzou&apos;s official{' '}
          <a href="https://offcampus.missouri.edu/" target="_blank" rel="noopener noreferrer">
            Off-Campus Housing Marketplace
          </a>
          . Walk times are estimates to {CAMPUS_CENTER.label}.
        </p>
      </div>
    </>
  )
}
