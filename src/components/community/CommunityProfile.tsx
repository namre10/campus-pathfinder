import React, { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import communities from '../../data/communities'
import events from '../../data/events'
import locations from '../../data/locations.json'
import PageHeading from '../PageHeading'
import EmptyState from '../EmptyState'
import CommunityCard from './CommunityCard'
import CommunityActivityCard from './CommunityActivityCard'
import EventMiniMap from '../events/EventMiniMap'
import { useToast } from '../../context/ToastContext'
import {
  getCategoryIcon,
  getCommunityActivities,
  getInitials,
  getRelatedCommunities,
} from '../../utils/community'

export default function CommunityProfile({
  joinedCommunities,
  toggleJoin,
  onViewLocation,
}: {
  joinedCommunities: number[]
  toggleJoin: (id: number) => void
  onViewLocation: (locationId: number) => void
}) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [copied, setCopied] = useState(false)

  const community = useMemo(
    () => communities.find(c => String(c.id) === String(id)),
    [id]
  )

  const activityEvents = useMemo(
    () => (community ? getCommunityActivities(community, events) : []),
    [community]
  )

  const related = useMemo(
    () => (community ? getRelatedCommunities(communities, community) : []),
    [community]
  )

  if (!community) {
    return (
      <div className="page-panel">
        <div className="content-panel">
          <PageHeading
            title="Community not found"
            description="Try returning to the directory to find another group."
            breadcrumbs={[{ label: 'Community', to: '/community' }, { label: 'Not found' }]}
            actions={
              <button type="button" className="btn primary" onClick={() => navigate('/community/directory')}>
                Back to directory
              </button>
            }
          />
        </div>
      </div>
    )
  }

  const location = locations.find((loc: { id: number }) => loc.id === community.locationId) as
    | { id: number; name: string; lat: number; lng: number; category?: string }
    | undefined
  const joined = joinedCommunities.includes(community.id)

  function handleToggleJoin() {
    toggleJoin(community.id)
    showToast(
      joined ? `Left "${community.name}"` : `Joined "${community.name}"!`,
      joined ? 'info' : 'success'
    )
  }

  async function shareCommunity() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      showToast('Community link copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast('Could not copy link', 'error')
    }
  }

  return (
    <div className="page-panel">
      <div className="content-panel">
        <PageHeading
          breadcrumbs={[{ label: 'Community', to: '/community' }, { label: community.name }]}
          title=""
          description=""
        />

        <div className="community-detail-hero">
          <span className="community-category-badge community-category-badge--large">
            {getCategoryIcon(community.category)} {community.category}
          </span>
          <h2 className="community-detail-title">{community.name}</h2>
          <p className="community-detail-meta">
            {community.memberCount} members · {community.meetingFormat} · {community.meetingSchedule}
          </p>
        </div>

        <div className="page-actions location-quick-actions">
          <button type="button" className={`btn${joined ? ' primary' : ''}`} onClick={handleToggleJoin}>
            {joined ? 'Joined' : 'Join community'}
          </button>
          {location && (
            <button type="button" className="btn" onClick={() => onViewLocation(location.id)}>
              View on map
            </button>
          )}
          <button type="button" className="btn" onClick={shareCommunity}>
            {copied ? 'Copied!' : 'Share'}
          </button>
        </div>

        <div className="event-detail-grid">
          <div className="section-panel">
            <h3>About</h3>
            <p>{community.description}</p>
            <div className="label-group">
              {community.tags.map(tag => (
                <span key={tag} className="label-chip">#{tag}</span>
              ))}
            </div>
          </div>

          <div className="section-panel">
            <h3>Community leader</h3>
            <div className="community-leader-row">
              <span className="advisor-avatar community-leader-avatar">{getInitials(community.leader)}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{community.leader}</div>
                <div className="meta">Student organizer · {community.category}</div>
              </div>
            </div>
            {location && (
              <dl className="detail-list" style={{ marginTop: 16 }}>
                <dt>Meeting location</dt>
                <dd>{location.name}</dd>
                <dt>Schedule</dt>
                <dd>{community.meetingSchedule}</dd>
                <dt>Format</dt>
                <dd>{community.meetingFormat}</dd>
              </dl>
            )}
          </div>
        </div>

        {location && (
          <div className="section-panel">
            <h3>Meeting location</h3>
            <EventMiniMap
              lat={location.lat}
              lng={location.lng}
              category={location.category}
              name={location.name}
            />
          </div>
        )}

        <div className="section-panel">
          <h3>Upcoming activities</h3>
          {activityEvents.length === 0 ? (
            <EmptyState
              icon="📅"
              title="No upcoming activities"
              description="Check back later or browse campus events for related meetups."
              actions={<Link to="/events" className="btn">Browse events</Link>}
            />
          ) : (
            <div className="card-grid card-grid--single">
              {activityEvents.map(ev => (
                <CommunityActivityCard key={ev.id} event={ev} onViewMap={onViewLocation} />
              ))}
            </div>
          )}
        </div>

        {related.length > 0 && (
          <div className="section-panel">
            <h3>Similar communities</h3>
            <div className="card-grid">
              {related.map(comm => (
                <CommunityCard
                  key={comm.id}
                  community={comm}
                  joined={joinedCommunities.includes(comm.id)}
                  onToggleJoin={() => {
                    const wasJoined = joinedCommunities.includes(comm.id)
                    toggleJoin(comm.id)
                    showToast(
                      wasJoined ? `Left "${comm.name}"` : `Joined "${comm.name}"!`,
                      wasJoined ? 'info' : 'success'
                    )
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
