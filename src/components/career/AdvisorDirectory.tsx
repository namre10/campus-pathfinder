import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AdvisorCard from './AdvisorCard'
import advisorsData from '../../data/advisors'
import type { Advisor, MeetingFormat } from '../../types/CareerAdvising'
import PageHeading from '../PageHeading'
import EmptyState from '../EmptyState'
import { filterAdvisors } from '../../utils/career'

const TOPIC_CHIPS = [
  { id: 'All', label: 'All' },
  { id: 'resume review', label: 'Resume' },
  { id: 'internships', label: 'Internships' },
  { id: 'interview preparation', label: 'Interview prep' },
  { id: 'graduate school', label: 'Grad school' },
  { id: 'networking', label: 'Networking' },
  { id: 'career_advisor', label: 'Career advisors' },
  { id: 'professor', label: 'Professors' },
]

const FORMAT_CHIPS: { id: MeetingFormat | 'all'; label: string }[] = [
  { id: 'all', label: 'Any format' },
  { id: 'in_person', label: 'In person' },
  { id: 'online', label: 'Online' },
]

export default function AdvisorDirectory() {
  const [advisors, setAdvisors] = useState<Advisor[]>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTopic = searchParams.get('topic') || 'All'
  const [topic, setTopic] = useState(initialTopic)
  const [format, setFormat] = useState<MeetingFormat | 'all'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => { setAdvisors(advisorsData) }, [])

  useEffect(() => {
    if (topic === 'All') {
      searchParams.delete('topic')
      setSearchParams(searchParams)
    } else {
      setSearchParams({ topic })
    }
  }, [topic, searchParams, setSearchParams])

  const filtered = useMemo(
    () => filterAdvisors(advisors, { topic, format, search }),
    [advisors, topic, format, search]
  )

  return (
    <div className="page-panel">
      <div className="content-panel">
        <PageHeading
          title="Advisor Directory"
          description="Browse professors, career advisors, alumni, and industry mentors by expertise and meeting format."
          breadcrumbs={[{ label: 'Career', to: '/career' }, { label: 'Directory' }]}
          actions={
            <>
              <Link to="/career/my-meetings" className="btn">My meetings</Link>
              <Link to="/career" className="btn">Career home</Link>
            </>
          }
        />

        <div className="event-toolbar">
          <input
            className="toolbar-input event-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search advisors by name, department, or expertise..."
          />
        </div>

        <div className="filter-chips">
          {TOPIC_CHIPS.map(c => (
            <button
              key={c.id}
              type="button"
              className={`filter-chip${topic === c.id ? ' active' : ''}`}
              onClick={() => setTopic(c.id)}
            >
              {c.label}
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

        {filtered.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No advisors match"
            description="Try a different topic, format, or search term."
            actions={
              <button type="button" className="btn primary" onClick={() => { setTopic('All'); setFormat('all'); setSearch('') }}>
                Clear filters
              </button>
            }
          />
        ) : (
          <div className="card-grid">
            {filtered.map(a => <AdvisorCard key={a.id} advisor={a} />)}
          </div>
        )}
      </div>
    </div>
  )
}
