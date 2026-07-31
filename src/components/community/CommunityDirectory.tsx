import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import communities from '../../data/communities'
import PageHeading from '../PageHeading'
import EmptyState from '../EmptyState'
import CommunityCard from './CommunityCard'
import { useToast } from '../../context/ToastContext'
import {
  CATEGORY_CHIPS,
  FORMAT_CHIPS,
  INTEREST_OPTIONS,
  filterCommunities,
  type CommunityFilterChip,
  type MeetingFormatFilter,
} from '../../utils/community'
import type { HobbyInterest } from '../../types/Community'

export default function CommunityDirectory({
  joinedCommunities,
  toggleJoin,
}: {
  joinedCommunities: number[]
  toggleJoin: (id: number) => void
}) {
  const { showToast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCategory = (searchParams.get('category') || 'all') as CommunityFilterChip
  const [category, setCategory] = useState<CommunityFilterChip>(initialCategory)
  const [format, setFormat] = useState<MeetingFormatFilter>('all')
  const [search, setSearch] = useState('')
  const [interests, setInterests] = useState<HobbyInterest[]>([])

  useEffect(() => {
    if (category === 'all') {
      searchParams.delete('category')
      setSearchParams(searchParams)
    } else {
      setSearchParams({ category })
    }
  }, [category, searchParams, setSearchParams])

  const filtered = useMemo(
    () => filterCommunities(communities, { search, category, format, interests, joinedIds: joinedCommunities }),
    [search, category, format, interests, joinedCommunities]
  )

  const joinedCount = joinedCommunities.length

  function toggleInterest(value: HobbyInterest) {
    setInterests(prev => (prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]))
  }

  function handleToggleJoin(id: number) {
    const comm = communities.find(c => c.id === id)
    const wasJoined = joinedCommunities.includes(id)
    toggleJoin(id)
    showToast(
      wasJoined ? `Left "${comm?.name}"` : `Joined "${comm?.name}"!`,
      wasJoined ? 'info' : 'success'
    )
  }

  return (
    <div className="page-panel">
      <div className="content-panel">
        <PageHeading
          title="Community Directory"
          description="Discover student communities by interest, category, and meeting format."
          breadcrumbs={[{ label: 'Community', to: '/community' }, { label: 'Directory' }]}
          actions={
            <>
              <Link to="/community/my-communities" className="btn">My communities</Link>
              <Link to="/community" className="btn">Community home</Link>
            </>
          }
        />

        <div className="event-toolbar">
          <input
            className="toolbar-input event-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, leader, tags, or description..."
          />
        </div>

        <div className="filter-chips">
          {CATEGORY_CHIPS.map(c => (
            <button
              key={c.id}
              type="button"
              className={`filter-chip${category === c.id ? ' active' : ''}`}
              onClick={() => setCategory(c.id)}
            >
              {c.label}
              {c.id === 'joined' && joinedCount > 0 && (
                <span className="filter-chip-count">{joinedCount}</span>
              )}
            </button>
          ))}
        </div>

        <div className="filter-chips" style={{ marginTop: 10 }}>
          {FORMAT_CHIPS.map(c => (
            <button
              key={c.id}
              type="button"
              className={`filter-chip filter-chip--sm${format === c.id ? ' active' : ''}`}
              onClick={() => setFormat(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="section-panel" style={{ marginTop: 20 }}>
          <h3>Filter by interest</h3>
          <p className="meta">Select one or more interests to narrow results.</p>
          <div className="interest-grid">
            {INTEREST_OPTIONS.map(opt => (
              <button
                key={opt.id}
                type="button"
                className={`interest-pill${interests.includes(opt.id) ? ' active' : ''}`}
                onClick={() => toggleInterest(opt.id)}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No communities match"
            description="Try a different category, format, interest, or search term."
            actions={
              <button
                type="button"
                className="btn primary"
                onClick={() => { setCategory('all'); setFormat('all'); setSearch(''); setInterests([]) }}
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <div className="card-grid">
            {filtered.map(comm => (
              <CommunityCard
                key={comm.id}
                community={comm}
                joined={joinedCommunities.includes(comm.id)}
                onToggleJoin={() => handleToggleJoin(comm.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
