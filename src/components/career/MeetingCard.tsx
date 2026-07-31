import React from 'react'
import { Link } from 'react-router-dom'
import type { CareerMeeting } from '../../types/CareerAdvising'
import {
  buildCalendarIcsForMeeting,
  formatMeetingTime,
  getAdvisor,
  getAdvisorInitials,
  getAdvisorName,
} from '../../utils/career'

export default function MeetingCard({
  meeting,
  locationName,
  onCancel,
  onViewMap,
  showActions = true,
}: {
  meeting: CareerMeeting
  locationName?: string
  onCancel?: () => void
  onViewMap?: () => void
  showActions?: boolean
}) {
  const advisor = getAdvisor(meeting.advisorId)
  const advisorName = getAdvisorName(meeting.advisorId)
  const initials = getAdvisorInitials(advisorName)
  const isCancelled = meeting.status === 'cancelled'
  const isConfirmed = meeting.status === 'confirmed'

  return (
    <article className={`meeting-card meeting-card--rich${isCancelled ? ' meeting-card--cancelled' : ''}`}>
      <div className="meeting-card-header">
        <div className="advisor-avatar">{initials}</div>
        <div>
          <div className="meeting-advisor-name">{advisorName}</div>
          <div className="meta">{advisor?.role} · {advisor?.department}</div>
        </div>
        <span className={`meeting-status-badge meeting-status-badge--${meeting.status}`}>
          {meeting.status}
        </span>
      </div>
      <div className="meta"><strong>Topic:</strong> {meeting.topic}</div>
      <div className="meta">{formatMeetingTime(meeting.startTime, meeting.endTime)}</div>
      <div className="meta">
        {meeting.meetingFormat === 'online' ? '💻 Online' : '🏫 In person'}
        {locationName && meeting.meetingFormat === 'in_person' ? ` · ${locationName}` : ''}
      </div>
      {meeting.studentMessage && (
        <p className="card-body" style={{ fontSize: '0.88rem' }}>"{meeting.studentMessage}"</p>
      )}
      {showActions && (
        <div className="card-actions">
          {isConfirmed && meeting.meetingLink && (
            <a href={meeting.meetingLink} target="_blank" rel="noreferrer" className="btn-link">Join meeting</a>
          )}
          {isConfirmed && meeting.startTime && (
            <a
              href={buildCalendarIcsForMeeting(meeting, advisorName, locationName)}
              download={`meeting-${advisorName.replace(/\s+/g, '-')}.ics`}
              className="btn"
            >
              Add to calendar
            </a>
          )}
          {isConfirmed && onViewMap && locationName && (
            <button type="button" className="btn" onClick={onViewMap}>View on map</button>
          )}
          {isConfirmed && onCancel && (
            <button type="button" className="btn" onClick={onCancel}>Cancel</button>
          )}
          {advisor && (
            <Link to={`/career/advisor/${advisor.id}`} className="btn">Advisor profile</Link>
          )}
        </div>
      )}
    </article>
  )
}
