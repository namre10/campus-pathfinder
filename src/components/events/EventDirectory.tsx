import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { EventItem } from '../../data/events'
import communities from '../../data/communities'
import PageHeading from '../PageHeading'
import EmptyState, { EmptyStateLink } from '../EmptyState'
import EventCard from './EventCard'
import EventTimeline from './EventTimeline'
import { useToast } from '../../context/ToastContext'
import {
  applyEventChip,
  isUpcoming,
  type EventFilterChip,
} from '../../utils/events'

const FILTER_CHIPS: { id: EventFilterChip; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'this-week', label: 'This week' },
  { id: 'events', label: 'Events' },
  { id: 'opportunities', label: 'Opportunities' },
  { id: 'saved', label: 'Saved' },
]

export default function EventDirectory({
  events: eventsProp,
  savedEvents,
  toggleSavedEvent,
}: {
  events: EventItem[]
  savedEvents: number[]
  toggleSavedEvent: (id: number) => void
}) {
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [chip, setChip] = useState<EventFilterChip>('all')
  const [view, setView] = useState<'grid' | 'timeline'>('grid')

  const upcoming = useMemo(() => eventsProp.filter(isUpcoming), [eventsProp])

  const filtered = useMemo(() => {
    return applyEventChip(upcoming, chip, savedEvents).filter(e => {
      const term = search.trim().toLowerCase()
      return term === '' || e.title.toLowerCase().includes(term) || e.description.toLowerCase().includes(term)
    })
  }, [upcoming, chip, savedEvents, search])

  function handleToggleSave(id: number) {
    const wasSaved = savedEvents.includes(id)
    toggleSavedEvent(id)
    const ev = eventsProp.find(e => e.id === id)
    showToast(
      wasSaved ? `Removed "${ev?.title}" from saved` : `Saved "${ev?.title}"`,
      wasSaved ? 'info' : 'success'
    )
  }

  const savedCount = savedEvents.filter(id => upcoming.some(e => e.id === id)).length

  return (
    <div className="page-panel">
      <div className="content-panel">
        <PageHeading
          title="Events & Opportunities"
          description="Discover campus events, career workshops, and student opportunities — save the ones you care about."
          breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Events' }]}
          actions={
            <>
              <Link to="/dashboard" className="btn">My dashboard</Link>
              <Link to="/" className="btn primary">Campus map</Link>
            </>
          }
        />

        <div className="event-stats">
          <div className="event-stat">
            <strong>{upcoming.length}</strong>
            <span>Upcoming</span>
          </div>
          <div className="event-stat">
            <strong>{savedCount}</strong>
            <span>Saved</span>
          </div>
          <div className="event-stat">
            <strong>{upcoming.filter(e => e.type === 'opportunity').length}</strong>
            <span>Opportunities</span>
          </div>
        </div>

        <div className="event-toolbar">
          <input
            className="toolbar-input event-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events and opportunities..."
          />
          <div className="view-toggle">
            <button
              type="button"
              className={`view-toggle-btn${view === 'grid' ? ' active' : ''}`}
              onClick={() => setView('grid')}
            >
              Grid
            </button>
            <button
              type="button"
              className={`view-toggle-btn${view === 'timeline' ? ' active' : ''}`}
              onClick={() => setView('timeline')}
            >
              Timeline
            </button>
          </div>
        </div>

        <div className="filter-chips">
          {FILTER_CHIPS.map(c => (
            <button
              key={c.id}
              type="button"
              className={`filter-chip${chip === c.id ? ' active' : ''}`}
              onClick={() => setChip(c.id)}
            >
              {c.label}
              {c.id === 'saved' && savedCount > 0 && (
                <span className="filter-chip-count">{savedCount}</span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={chip === 'saved' ? '⭐' : '🔍'}
            title={chip === 'saved' ? 'No saved events yet' : 'No events match your filters'}
            description={
              chip === 'saved'
                ? 'Save events from the directory to track them on your dashboard.'
                : 'Try a different filter or search term.'
            }
            actions={
              chip === 'saved' ? (
                <button type="button" className="btn primary" onClick={() => setChip('all')}>Browse all events</button>
              ) : (
                <>
                  <button type="button" className="btn" onClick={() => { setChip('all'); setSearch('') }}>Clear filters</button>
                  <EmptyStateLink to="/" primary>Browse campus map</EmptyStateLink>
                </>
              )
            }
          />
        ) : view === 'timeline' ? (
          <EventTimeline
            events={filtered}
            savedEvents={savedEvents}
            communities={communities}
            onToggleSave={handleToggleSave}
          />
        ) : (
          <div className="card-grid">
            {filtered.map(ev => (
              <EventCard
                key={ev.id}
                event={ev}
                community={ev.communityId ? communities.find(c => c.id === ev.communityId) : null}
                saved={savedEvents.includes(ev.id)}
                onToggleSave={() => handleToggleSave(ev.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
