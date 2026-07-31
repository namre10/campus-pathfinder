import React from 'react'
import type { EventItem } from '../../data/events'
import type { Community } from '../../types/Community'
import { groupEventsByDate } from '../../utils/events'
import EventCard from './EventCard'

export default function EventTimeline({
  events,
  savedEvents,
  communities,
  onToggleSave,
}: {
  events: EventItem[]
  savedEvents: number[]
  communities: typeof import('../../data/communities').default
  onToggleSave: (id: number) => void
}) {
  const groups = groupEventsByDate(events)

  if (groups.length === 0) return null

  return (
    <div className="event-timeline">
      {groups.map(([dateLabel, items]) => (
        <section key={dateLabel} className="event-timeline-group">
          <h3 className="event-timeline-date">{dateLabel}</h3>
          <div className="card-grid card-grid--single">
            {items.map(ev => (
              <EventCard
                key={ev.id}
                event={ev}
                community={ev.communityId ? communities.find(c => c.id === ev.communityId) : null}
                saved={savedEvents.includes(ev.id)}
                onToggleSave={() => onToggleSave(ev.id)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
