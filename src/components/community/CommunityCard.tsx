import React from 'react'
import { Link } from 'react-router-dom'
import type { Community } from '../../types/Community'
import { getCategoryIcon } from '../../utils/community'

export default function CommunityCard({
  community,
  joined,
  onToggleJoin,
  showJoinButton = true,
}: {
  community: Community
  joined: boolean
  onToggleJoin?: () => void
  showJoinButton?: boolean
}) {
  return (
    <article className="community-card community-card--rich">
      <div className="community-card-header">
        <span className="community-category-badge">{getCategoryIcon(community.category)} {community.category}</span>
        {joined && <span className="community-joined-badge">Joined</span>}
      </div>
      <Link to={`/community/${community.id}`} className="card-title-link">{community.name}</Link>
      <div className="meta">Led by {community.leader}</div>
      <p className="card-body">{community.description}</p>
      <div className="label-group">
        <span className="label-chip">{community.memberCount} members</span>
        <span className="label-chip">{community.meetingFormat}</span>
        <span className="label-chip">{community.meetingSchedule}</span>
      </div>
      <div className="label-group">
        {community.tags.slice(0, 4).map(tag => (
          <span key={tag} className="label-chip">#{tag}</span>
        ))}
      </div>
      <div className="card-actions">
        <Link to={`/community/${community.id}`} className="btn">View details</Link>
        {showJoinButton && onToggleJoin && (
          <button
            type="button"
            className={`btn${joined ? ' primary' : ''}`}
            onClick={e => { e.preventDefault(); onToggleJoin() }}
          >
            {joined ? 'Joined' : 'Join'}
          </button>
        )}
      </div>
    </article>
  )
}
