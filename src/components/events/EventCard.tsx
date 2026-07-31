import React from 'react'
import { Link } from 'react-router-dom'
import type { EventItem } from '../../data/events'
import type { Community } from '../../types/Community'
import { formatEventTime } from '../../utils/events'

export default function EventCard({
  event,
  community,
  saved,
  onToggleSave,
}: {
  event: EventItem
  community?: Community | null
  saved: boolean
  onToggleSave: () => void
}) {
  return (
    <article className="event-card event-card--rich">
      <div className="event-card-header">
        <span className={`event-type-badge event-type-badge--${event.type}`}>
          {event.type === 'event' ? 'Event' : 'Opportunity'}
        </span>
        {event.deadline && (
          <span className="event-deadline-badge">
            Due {new Date(event.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
      <Link to={`/events/${event.id}`} className="card-title-link">{event.title}</Link>
      <div className="meta">{formatEventTime(event)}</div>
      {community && <div className="meta">Hosted by {community.name}</div>}
      <p className="card-body">{event.description}</p>
      <div className="label-group">
        {event.eligibility && <span className="label-chip">{event.eligibility}</span>}
        {event.onlineLink && <span className="label-chip">Online option</span>}
        {event.locationId && <span className="label-chip">On campus</span>}
      </div>
      <div className="card-actions">
        <button
          type="button"
          className={`btn${saved ? ' primary' : ''}`}
          onClick={onToggleSave}
        >
          {saved ? 'Saved' : 'Save'}
        </button>
        <Link to={`/events/${event.id}`} className="btn">Details</Link>
        {event.registrationLink && (
          <a href={event.registrationLink} target="_blank" rel="noreferrer" className="btn-link">Register</a>
        )}
      </div>
    </article>
  )
}
