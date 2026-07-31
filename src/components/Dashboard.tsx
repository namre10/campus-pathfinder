import React, { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import locations from '../data/locations.json'
import PageHeading from './PageHeading'
import EmptyState from './EmptyState'
import MeetingCard from './career/MeetingCard'
import DashboardSection from './dashboard/DashboardSection'
import DashboardNextUp from './dashboard/DashboardNextUp'
import DashboardQuickLinks from './dashboard/DashboardQuickLinks'
import { formatEventTime } from '../utils/events'
import { buildDashboardSnapshot, isDashboardEmpty } from '../utils/dashboard'
import { getCategoryIcon } from '../utils/community'

type LocationRow = {
  id: number
  name: string
  category: string
  lat: number
  lng: number
}

export default function Dashboard({
  savedEvents,
  joinedCommunities,
  favorites,
  onViewLocation,
}: {
  savedEvents: number[]
  joinedCommunities: number[]
  favorites: number[]
  onViewLocation: (locationId: number) => void
}) {
  const navigate = useNavigate()

  const snapshot = useMemo(
    () => buildDashboardSnapshot({
      savedEventIds: savedEvents,
      joinedCommunityIds: joinedCommunities,
      favoriteIds: favorites,
    }),
    [savedEvents, joinedCommunities, favorites]
  )

  const favoriteLocations = useMemo(
    () => favorites
      .map(id => (locations as LocationRow[]).find(l => l.id === id))
      .filter((l): l is LocationRow => Boolean(l)),
    [favorites]
  )

  const empty = isDashboardEmpty(snapshot)

  return (
    <div className="page-panel">
      <div className="content-panel">
        <PageHeading
          title="Student Dashboard"
          description="Your campus hub — upcoming events, career meetings, saved places, and communities in one place."
          breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Dashboard' }]}
          actions={
            <>
              <button type="button" className="btn" onClick={() => navigate('/events')}>Browse events</button>
              <button type="button" className="btn" onClick={() => navigate('/community')}>Communities</button>
              <button type="button" className="btn primary" onClick={() => navigate('/')}>Campus map</button>
            </>
          }
        />

        <div className="event-stats dashboard-stats">
          <div className="event-stat">
            <strong>{snapshot.savedEventCount}</strong>
            <span>Saved events</span>
          </div>
          <div className="event-stat">
            <strong>{snapshot.careerMeetingCount}</strong>
            <span>Meetings</span>
          </div>
          <div className="event-stat">
            <strong>{snapshot.favoriteCount}</strong>
            <span>Saved places</span>
          </div>
          <div className="event-stat">
            <strong>{snapshot.joinedCount}</strong>
            <span>Communities</span>
          </div>
        </div>

        {empty ? (
          <div className="section-panel dashboard-welcome">
            <EmptyState
              icon="✨"
              title="Welcome to Campus Pathfinder"
              description="Save events, join communities, book career meetings, and favorite map locations — they'll all show up here."
              actions={
                <>
                  <Link to="/events" className="btn primary">Browse events</Link>
                  <Link to="/community/directory" className="btn">Find communities</Link>
                </>
              }
            />
          </div>
        ) : (
          snapshot.nextUp.length > 0 && (
            <div className="section-panel">
              <h3>Next up</h3>
              <p className="meta">Your upcoming saved events, career meetings, and community activities — sorted by date.</p>
              <DashboardNextUp items={snapshot.nextUp} onViewMap={onViewLocation} />
            </div>
          )
        )}

        <div className="section-panel">
          <h3>Quick links</h3>
          <DashboardQuickLinks />
        </div>

        <div className="dashboard-grid">
          <DashboardSection title="Saved events" viewAllTo="/events" viewAllLabel="Browse events">
            {snapshot.upcomingSavedEvents.length === 0 ? (
              <EmptyState
                icon="📅"
                title="No saved events"
                description="Save events from the directory to track them here."
                actions={<Link to="/events" className="btn primary">Browse events</Link>}
              />
            ) : (
              <div className="card-grid card-grid--single">
                {snapshot.upcomingSavedEvents.map(ev => (
                  <Link key={ev.id} to={`/events/${ev.id}`} className="dashboard-item-card dashboard-link-card">
                    <span className={`dashboard-badge dashboard-badge--event${ev.type === 'opportunity' ? ' dashboard-badge--opportunity' : ''}`}>
                      {ev.type === 'opportunity' ? 'Opportunity' : 'Event'}
                    </span>
                    <div className="dashboard-item-title">{ev.title}</div>
                    <div className="meta">{formatEventTime(ev)}</div>
                  </Link>
                ))}
              </div>
            )}
          </DashboardSection>

          <DashboardSection title="Career meetings" viewAllTo="/career/my-meetings" viewAllLabel="My meetings">
            {snapshot.upcomingMeetings.length === 0 ? (
              <EmptyState
                icon="🎯"
                title="No meetings booked"
                description="Book a career advising session with a campus mentor."
                actions={<Link to="/career/directory" className="btn primary">Find an advisor</Link>}
              />
            ) : (
              <div className="card-grid card-grid--single">
                {snapshot.upcomingMeetings.map(m => {
                  const loc = m.locationId
                    ? (locations as LocationRow[]).find(l => l.id === m.locationId)
                    : undefined
                  return (
                    <MeetingCard
                      key={m.id}
                      meeting={m}
                      locationName={loc?.name}
                      showActions={false}
                    />
                  )
                })}
              </div>
            )}
          </DashboardSection>

          <DashboardSection title="Saved locations" viewAllTo="/" viewAllLabel="Open map">
            {favoriteLocations.length === 0 ? (
              <EmptyState
                icon="📍"
                title="No saved locations"
                description="Favorite places on the campus map to find them quickly."
                actions={<Link to="/" className="btn primary">Explore map</Link>}
              />
            ) : (
              <div className="card-grid card-grid--single">
                {favoriteLocations.map(loc => (
                  <div key={loc.id} className="dashboard-item-card dashboard-location-card">
                    <span className="dashboard-badge dashboard-badge--location">{loc.category}</span>
                    <div className="dashboard-item-title">{loc.name}</div>
                    <div className="card-actions">
                      <button type="button" className="btn primary" onClick={() => onViewLocation(loc.id)}>
                        View on map
                      </button>
                      <Link to={`/location/${loc.id}`} className="btn">Details</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardSection>

          <DashboardSection title="My communities" viewAllTo="/community/my-communities" viewAllLabel="View all">
            {snapshot.joinedCommunities.length === 0 ? (
              <EmptyState
                icon="👥"
                title="No joined communities"
                description="Explore the directory to find clubs and groups that match your interests."
                actions={<Link to="/community/directory" className="btn primary">Browse communities</Link>}
              />
            ) : (
              <div className="card-grid card-grid--single">
                {snapshot.joinedCommunities.map(comm => (
                  <Link key={comm.id} to={`/community/${comm.id}`} className="dashboard-item-card dashboard-link-card">
                    <span className="dashboard-badge dashboard-badge--activity">
                      {getCategoryIcon(comm.category)} {comm.category}
                    </span>
                    <div className="dashboard-item-title">{comm.name}</div>
                    <div className="meta">Led by {comm.leader}</div>
                    <div className="meta">{comm.meetingSchedule} · {comm.meetingFormat}</div>
                  </Link>
                ))}
              </div>
            )}
          </DashboardSection>
        </div>
      </div>
    </div>
  )
}
