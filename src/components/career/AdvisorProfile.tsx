import React, { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import advisorsData from '../../data/advisors'
import slotsData from '../../data/availabilitySlots'
import locations from '../../data/locations.json'
import { Advisor, AvailabilitySlot, CareerMeeting } from '../../types/CareerAdvising'
import PageHeading from '../PageHeading'
import BookingConfirmation from './BookingConfirmation'
import { useToast } from '../../context/ToastContext'
import {
  getAdvisorInitials,
  getBookedSlotIds,
  loadMeetings,
  saveMeetings,
  PROVIDER_LABELS,
} from '../../utils/career'

export default function AdvisorProfile({
  onViewLocation,
}: {
  onViewLocation?: (locationId: number) => void
}) {
  const { id } = useParams()
  const { showToast } = useToast()
  const [advisor, setAdvisor] = useState<Advisor | undefined>()
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null)
  const [confirmedMeeting, setConfirmedMeeting] = useState<CareerMeeting | null>(null)
  const [topic, setTopic] = useState('resume review')
  const [studentMessage, setStudentMessage] = useState('')
  const [meetingFormat, setMeetingFormat] = useState<'in_person' | 'online'>('in_person')

  useEffect(() => {
    const currentAdvisor = advisorsData.find(a => String(a.id) === String(id))
    setAdvisor(currentAdvisor)
    const booked = getBookedSlotIds()
    const advisorSlots = slotsData
      .filter(s => String(s.advisorId) === String(id))
      .map(s => ({ ...s, isAvailable: s.isAvailable && !booked.includes(s.id) }))
    setSlots(advisorSlots)
    if (currentAdvisor) {
      setMeetingFormat(currentAdvisor.meetingFormats[0] || 'in_person')
      setTopic(currentAdvisor.expertise[0] || 'career advising')
    }
    setSelectedSlot(null)
    setConfirmedMeeting(null)
  }, [id])

  const availableSlots = useMemo(() => slots.filter(s => s.isAvailable), [slots])
  const loc = advisor?.locationId
    ? locations.find((l: { id: number }) => l.id === advisor.locationId)
    : null

  function bookSelectedSlot() {
    if (!selectedSlot || !advisor) return
    const meetings = loadMeetings()
    const booking: CareerMeeting = {
      id: `${Date.now()}-${selectedSlot.id}`,
      advisorId: advisor.id,
      availabilitySlotId: selectedSlot.id,
      topic,
      studentMessage,
      meetingFormat,
      locationId: meetingFormat === 'in_person' ? advisor.locationId : undefined,
      meetingLink: meetingFormat === 'online' ? `https://campus.edu/meet/${selectedSlot.id}` : undefined,
      status: 'confirmed',
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
    }
    saveMeetings([...meetings, booking])
    setSlots(prev => prev.map(s => s.id === selectedSlot.id ? { ...s, isAvailable: false } : s))
    setConfirmedMeeting(booking)
    setSelectedSlot(null)
    setStudentMessage('')
    showToast(`Meeting booked with ${advisor.name}`, 'success')
  }

  if (!advisor) {
    return (
      <div className="page-panel">
        <div className="content-panel">
          <PageHeading
            title="Advisor not found"
            breadcrumbs={[{ label: 'Career', to: '/career' }, { label: 'Not found' }]}
            actions={<Link to="/career/directory" className="btn primary">Back to directory</Link>}
          />
        </div>
      </div>
    )
  }

  if (confirmedMeeting) {
    return (
      <div className="page-panel">
        <div className="content-panel">
          <BookingConfirmation meeting={confirmedMeeting} onViewLocation={onViewLocation} />
        </div>
      </div>
    )
  }

  const initials = getAdvisorInitials(advisor.name)

  return (
    <div className="page-panel">
      <div className="content-panel">
        <PageHeading
          breadcrumbs={[{ label: 'Career', to: '/career' }, { label: 'Directory', to: '/career/directory' }, { label: advisor.name }]}
          title=""
          description=""
        />

        <div className="advisor-profile-hero">
          <div className="advisor-avatar advisor-avatar--lg">{initials}</div>
          <div>
            <span className="label-chip">{PROVIDER_LABELS[advisor.providerType] || 'Mentor'}</span>
            <h2 className="event-detail-title">{advisor.name}</h2>
            <p className="meta">{advisor.role} · {advisor.department}</p>
          </div>
        </div>

        <div className="page-actions location-quick-actions">
          {advisor.locationId && onViewLocation && (
            <button type="button" className="btn" onClick={() => onViewLocation(advisor.locationId!)}>View on map</button>
          )}
          <Link to="/career/my-meetings" className="btn">My meetings</Link>
        </div>

        <div className="event-detail-grid">
          <div className="section-panel">
            <h3>About</h3>
            <p>{advisor.bio}</p>
            <div className="label-group">
              {advisor.expertise.map(t => <span key={t} className="label-chip">{t}</span>)}
            </div>
          </div>
          <div className="section-panel">
            <h3>Meeting options</h3>
            <dl className="detail-list">
              <dt>Formats</dt>
              <dd>{advisor.meetingFormats.map(f => f === 'in_person' ? 'In person' : 'Online').join(', ')}</dd>
              {loc && (
                <>
                  <dt>Office</dt>
                  <dd>{loc.name}</dd>
                  <dt>Hours</dt>
                  <dd>{loc.hours || 'By appointment'}</dd>
                </>
              )}
              <dt>Available slots</dt>
              <dd>{availableSlots.length} open</dd>
            </dl>
          </div>
        </div>

        <div className="section-panel">
          <h3>Book a session</h3>
          {availableSlots.length === 0 ? (
            <div className="empty">No open slots right now. Check back later or browse other advisors.</div>
          ) : (
            <div className="slot-grid">
              {availableSlots.map(s => (
                <button
                  key={s.id}
                  type="button"
                  className={`slot-card${selectedSlot?.id === s.id ? ' slot-card--selected' : ''}`}
                  onClick={() => setSelectedSlot(s)}
                >
                  <div className="slot-card-date">{new Date(s.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                  <div className="slot-card-time">
                    {new Date(s.startTime).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                    {' – '}
                    {new Date(s.endTime).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedSlot && (
          <div className="section-panel booking-form-panel">
            <h3>Confirm your booking</h3>
            <div className="form-stack">
              <div className="form-field">
                <span className="control-label">Selected time</span>
                <div>{new Date(selectedSlot.startTime).toLocaleString()} — {new Date(selectedSlot.endTime).toLocaleTimeString()}</div>
              </div>
              <div className="form-field">
                <label className="control-label" htmlFor="book-topic">Topic</label>
                <select id="book-topic" className="control-input" value={topic} onChange={e => setTopic(e.target.value)}>
                  {advisor.expertise.map(item => <option key={item} value={item}>{item}</option>)}
                  <option value="career advising">General career advising</option>
                </select>
              </div>
              <div className="form-field">
                <label className="control-label" htmlFor="book-format">Meeting format</label>
                <select id="book-format" className="control-input" value={meetingFormat} onChange={e => setMeetingFormat(e.target.value as 'in_person' | 'online')}>
                  {advisor.meetingFormats.map(f => (
                    <option key={f} value={f}>{f === 'in_person' ? 'In person' : 'Online'}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label className="control-label" htmlFor="book-message">What would you like to discuss?</label>
                <textarea
                  id="book-message"
                  className="control-input"
                  rows={4}
                  value={studentMessage}
                  onChange={e => setStudentMessage(e.target.value)}
                  placeholder="Briefly describe your goals, questions, or what you'd like help with."
                />
              </div>
              <div className="card-actions">
                <button type="button" className="btn primary" onClick={bookSelectedSlot}>Confirm booking</button>
                <button type="button" className="btn" onClick={() => setSelectedSlot(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
