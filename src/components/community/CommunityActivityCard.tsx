import React from 'react'
import { Link } from 'react-router-dom'
import type { EventItem } from '../../data/events'
import { formatEventTime } from '../../utils/events'

export default function CommunityActivityCard({
  event,
  onViewMap,
}: {
  event: EventItem
  onViewMap?: (locationId: number) => void
}) {
  return (
    <article className="community-activity-card">
      <div className="community-activity-card-header">
        <span className="community-activity-badge">Upcoming activity</span>
      </div>
      <Link to={`/events/${event.id}`} className="card-title-link">{event.title}</Link>
      <div className="meta">{formatEventTime(event)}</div>
      <p className="card-body">{event.description}</p>
      <div className="card-actions">
        <Link to={`/events/${event.id}`} className="btn">View event</Link>
        {event.locationId && onViewMap && (
          <button type="button" className="btn" onClick={() => onViewMap(event.locationId!)}>
            View on map
          </button>
        )}
        {event.registrationLink && (
          <a href={event.registrationLink} target="_blank" rel="noreferrer" className="btn-link">
            Register
          </a>
        )}
      </div>
    </article>
  )
}
