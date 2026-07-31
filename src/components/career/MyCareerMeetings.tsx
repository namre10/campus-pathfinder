import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CareerMeeting } from '../../types/CareerAdvising'
import locations from '../../data/locations.json'
import PageHeading from '../PageHeading'
import MeetingCard from './MeetingCard'
import EmptyState from '../EmptyState'
import ConfirmDialog from '../ConfirmDialog'
import { useToast } from '../../context/ToastContext'
import { getAdvisorName, loadMeetings, saveMeetings, upcomingMeetings } from '../../utils/career'

type Tab = 'upcoming' | 'past' | 'cancelled'

export default function MyCareerMeetings({ onViewLocation }: { onViewLocation?: (locationId: number) => void }) {
  const { showToast } = useToast()
  const [meetings, setMeetings] = useState<CareerMeeting[]>([])
  const [tab, setTab] = useState<Tab>('upcoming')
  const [cancelTarget, setCancelTarget] = useState<CareerMeeting | null>(null)

  useEffect(() => {
    setMeetings(loadMeetings())
  }, [])

  const now = new Date()
  const filtered = useMemo(() => {
    if (tab === 'cancelled') return meetings.filter(m => m.status === 'cancelled')
    if (tab === 'upcoming') return upcomingMeetings(meetings)
    return meetings.filter(m =>
      m.status === 'confirmed' && m.startTime && new Date(m.startTime) < now
    )
  }, [meetings, tab, now])

  function confirmCancel() {
    if (!cancelTarget) return
    const updated = meetings.map(m =>
      m.id === cancelTarget.id ? { ...m, status: 'cancelled' as const } : m
    )
    setMeetings(updated)
    saveMeetings(updated)
    showToast(`Cancelled meeting with ${getAdvisorName(cancelTarget.advisorId)}`, 'info')
    setCancelTarget(null)
  }

  return (
    <div className="page-panel">
      <div className="content-panel">
        <PageHeading
          title="My Career Meetings"
          description="Manage your confirmed sessions, join online meetings, and view past appointments."
          breadcrumbs={[{ label: 'Career', to: '/career' }, { label: 'My meetings' }]}
          actions={
            <>
              <Link to="/career/directory" className="btn primary">Book a meeting</Link>
              <Link to="/career" className="btn">Career home</Link>
            </>
          }
        />

        <div className="view-toggle" style={{ marginTop: 20 }}>
          <button type="button" className={`view-toggle-btn${tab === 'upcoming' ? ' active' : ''}`} onClick={() => setTab('upcoming')}>
            Upcoming ({upcomingMeetings(meetings).length})
          </button>
          <button type="button" className={`view-toggle-btn${tab === 'past' ? ' active' : ''}`} onClick={() => setTab('past')}>
            Past
          </button>
          <button type="button" className={`view-toggle-btn${tab === 'cancelled' ? ' active' : ''}`} onClick={() => setTab('cancelled')}>
            Cancelled
          </button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon="📅"
            title={tab === 'upcoming' ? 'No upcoming meetings' : tab === 'past' ? 'No past meetings' : 'No cancelled meetings'}
            description={
              tab === 'upcoming'
                ? 'Book a session with an advisor to get started.'
                : 'Your meeting history will appear here.'
            }
            actions={
              tab === 'upcoming' ? (
                <Link to="/career/directory" className="btn primary">Find an advisor</Link>
              ) : undefined
            }
          />
        ) : (
          <div className="card-grid card-grid--single" style={{ marginTop: 20 }}>
            {filtered.map(m => {
              const loc = m.locationId
                ? locations.find((l: { id: number }) => l.id === m.locationId)
                : null
              return (
                <MeetingCard
                  key={m.id}
                  meeting={m}
                  locationName={loc?.name}
                  onCancel={m.status === 'confirmed' ? () => setCancelTarget(m) : undefined}
                  onViewMap={loc && onViewLocation ? () => onViewLocation(m.locationId!) : undefined}
                />
              )
            })}
          </div>
        )}

        <ConfirmDialog
          open={Boolean(cancelTarget)}
          title="Cancel meeting?"
          message={
            cancelTarget
              ? `Cancel your ${cancelTarget.topic} session with ${getAdvisorName(cancelTarget.advisorId)}?`
              : ''
          }
          confirmLabel="Yes, cancel"
          cancelLabel="Keep meeting"
          danger
          onConfirm={confirmCancel}
          onCancel={() => setCancelTarget(null)}
        />
      </div>
    </div>
  )
}
