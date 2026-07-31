import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import events from '../../data/events'
import communities from '../../data/communities'
import locations from '../../data/locations.json'
import PageHeading from '../PageHeading'
import EventCard from './EventCard'
import EventMiniMap from './EventMiniMap'
import { useToast } from '../../context/ToastContext'
import {
  buildCalendarIcs,
  formatEventTime,
  getRelatedEvents,
} from '../../utils/events'

export default function EventDetail({
  savedEvents,
  toggleSavedEvent,
  onViewMap,
}: {
  savedEvents: number[]
  toggleSavedEvent: (id: number) => void
  onViewMap: (locationId: number) => void
}) {
  const { id } = useParams()
  const { showToast } = useToast()
  const [copied, setCopied] = useState(false)
  const ev = events.find(e => String(e.id) === String(id))

  if (!ev) {
    return (
      <div className="page-panel">
        <div className="content-panel">
          <PageHeading
            title="Event not found"
            breadcrumbs={[{ label: 'Events', to: '/events' }, { label: 'Not found' }]}
            actions={<Link to="/events" className="btn primary">Back to events</Link>}
          />
        </div>
      </div>
    )
  }

  const loc = ev.locationId ? locations.find((l: { id: number }) => l.id === ev.locationId) : null
  const community = ev.communityId ? communities.find(c => c.id === ev.communityId) : null
  const isSaved = savedEvents.includes(ev.id)
  const related = getRelatedEvents(events, ev)

  function handleToggleSave() {
    toggleSavedEvent(ev.id)
    showToast(isSaved ? `Removed "${ev.title}" from saved` : `Saved "${ev.title}"`, isSaved ? 'info' : 'success')
  }

  async function shareEvent() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      showToast('Event link copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast('Could not copy link', 'error')
    }
  }

  return (
    <div className="page-panel">
      <div className="content-panel">
        <PageHeading
          breadcrumbs={[{ label: 'Events', to: '/events' }, { label: ev.title }]}
          title=""
          description=""
        />

        <div className={`event-detail-hero event-detail-hero--${ev.type}`}>
          <span className={`event-type-badge event-type-badge--large event-type-badge--${ev.type}`}>
            {ev.type === 'event' ? 'Campus Event' : 'Opportunity'}
          </span>
          <h2 className="event-detail-title">{ev.title}</h2>
          <p className="event-detail-time">{formatEventTime(ev)}</p>
        </div>

        <div className="page-actions location-quick-actions">
          <button type="button" className={`btn${isSaved ? ' primary' : ''}`} onClick={handleToggleSave}>
            {isSaved ? 'Saved' : 'Save event'}
          </button>
          <a href={buildCalendarIcs(ev, loc?.name)} download={`${ev.title.replace(/\s+/g, '-')}.ics`} className="btn">
            Add to calendar
          </a>
          <button type="button" className="btn" onClick={shareEvent}>
            {copied ? 'Copied!' : 'Share'}
          </button>
          {ev.registrationLink && (
            <a href={ev.registrationLink} target="_blank" rel="noreferrer" className="btn-link">Register</a>
          )}
        </div>

        <div className="event-detail-grid">
          <div className="section-panel">
            <h3>About</h3>
            <p>{ev.description}</p>
            <div className="label-group">
              {ev.eligibility && <span className="label-chip">{ev.eligibility}</span>}
              {ev.deadline && (
                <span className="label-chip">
                  Deadline: {new Date(ev.deadline).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}
                </span>
              )}
              {ev.onlineLink && <span className="label-chip">Online option available</span>}
            </div>
          </div>

          <div className="section-panel">
            <h3>Details</h3>
            <dl className="detail-list">
              <dt>Type</dt>
              <dd>{ev.type === 'event' ? 'Campus event' : 'Opportunity'}</dd>
              {community && (
                <>
                  <dt>Community</dt>
                  <dd><Link to={`/community/${community.id}`}>{community.name}</Link></dd>
                </>
              )}
              {loc && (
                <>
                  <dt>Location</dt>
                  <dd>{loc.name} · {loc.category}</dd>
                  <dt>Hours</dt>
                  <dd>{loc.hours || 'See location for hours'}</dd>
                </>
              )}
              {ev.onlineLink && (
                <>
                  <dt>Online</dt>
                  <dd><a href={ev.onlineLink} target="_blank" rel="noreferrer">View online details</a></dd>
                </>
              )}
            </dl>
            {loc && (
              <div className="card-actions">
                <button type="button" className="btn primary" onClick={() => onViewMap(loc.id)}>View on campus map</button>
              </div>
            )}
          </div>
        </div>

        {loc && (
          <div className="section-panel">
            <h3>Location preview</h3>
            <EventMiniMap lat={loc.lat} lng={loc.lng} category={loc.category} name={loc.name} />
          </div>
        )}

        {related.length > 0 && (
          <div className="section-panel">
            <h3>You might also like</h3>
            <div className="card-grid">
              {related.map(r => (
                <EventCard
                  key={r.id}
                  event={r}
                  community={r.communityId ? communities.find(c => c.id === r.communityId) : null}
                  saved={savedEvents.includes(r.id)}
                  onToggleSave={() => {
                    const wasSaved = savedEvents.includes(r.id)
                    toggleSavedEvent(r.id)
                    showToast(wasSaved ? 'Removed from saved' : `Saved "${r.title}"`, wasSaved ? 'info' : 'success')
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
