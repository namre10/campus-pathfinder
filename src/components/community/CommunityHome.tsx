import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import communities from '../../data/communities'
import events from '../../data/events'
import PageHeading from '../PageHeading'
import EmptyState from '../EmptyState'
import CommunityCard from './CommunityCard'
import {
  CATEGORY_ICONS,
  countUpcomingCommunityActivities,
  getRecommendedCommunities,
} from '../../utils/community'
import type { CommunityCategory } from '../../types/Community'

const flowSteps = ['Browse groups', 'Pick interests', 'Join a community', 'Attend activities', 'Meet on campus']

export default function CommunityHome({
  joinedCommunities,
}: {
  joinedCommunities: number[]
}) {
  const joinedItems = useMemo(
    () => communities.filter(c => joinedCommunities.includes(c.id)),
    [joinedCommunities]
  )

  const recommended = useMemo(
    () => getRecommendedCommunities(communities, [], joinedCommunities, 3),
    [joinedCommunities]
  )

  const activityCount = useMemo(
    () => countUpcomingCommunityActivities(communities, events),
    []
  )

  const categories = Object.entries(CATEGORY_ICONS) as [CommunityCategory, string][]

  return (
    <div className="page-panel">
      <div className="content-panel">
        <PageHeading
          title="Student Communities"
          description="Find clubs, interest groups, and campus communities — join the ones that match your hobbies and goals."
          breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Community' }]}
          actions={
            <>
              <Link to="/community/directory" className="btn primary">Browse directory</Link>
              <Link to="/community/my-communities" className="btn">My communities</Link>
            </>
          }
        />

        <div className="event-stats">
          <div className="event-stat">
            <strong>{communities.length}</strong>
            <span>Communities</span>
          </div>
          <div className="event-stat">
            <strong>{joinedCommunities.length}</strong>
            <span>Joined</span>
          </div>
          <div className="event-stat">
            <strong>{activityCount}</strong>
            <span>Upcoming activities</span>
          </div>
        </div>

        <div className="section-panel">
          <h3>How it works</h3>
          <div className="career-flow">
            {flowSteps.map((step, i) => (
              <div key={step} className="career-flow-step">
                <span className="career-flow-num">{i + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="section-panel">
          <h3>Explore by category</h3>
          <div className="topic-grid">
            {categories.map(([cat, icon]) => (
              <Link
                key={cat}
                to={`/community/directory?category=${encodeURIComponent(cat)}`}
                className="topic-card"
              >
                <span className="topic-icon">{icon}</span>
                <div>
                  <strong>{cat}</strong>
                  <p>
                    {communities.filter(c => c.category === cat).length} communities in {cat.toLowerCase()}.
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="section-panel">
          <h3>Your communities</h3>
          {joinedItems.length === 0 ? (
            <EmptyState
              icon="👥"
              title="No communities joined yet"
              description="Browse the directory and join groups that match your interests."
              actions={<Link to="/community/directory" className="btn primary">Find a community</Link>}
            />
          ) : (
            <>
              <div className="card-grid">
                {joinedItems.slice(0, 3).map(comm => (
                  <CommunityCard
                    key={comm.id}
                    community={comm}
                    joined
                    showJoinButton={false}
                  />
                ))}
              </div>
              {joinedItems.length > 3 && (
                <div className="card-actions" style={{ marginTop: 14 }}>
                  <Link to="/community/my-communities" className="btn">View all joined</Link>
                </div>
              )}
            </>
          )}
        </div>

        <div className="section-panel">
          <h3>Recommended for you</h3>
          {recommended.length === 0 ? (
            <EmptyState
              icon="✨"
              title="You're all caught up"
              description="You've joined the top communities — check back as new groups are added."
              actions={<Link to="/community/directory" className="btn">Browse directory</Link>}
            />
          ) : (
            <div className="card-grid">
              {recommended.map(comm => (
                <CommunityCard
                  key={comm.id}
                  community={comm}
                  joined={joinedCommunities.includes(comm.id)}
                  showJoinButton={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
