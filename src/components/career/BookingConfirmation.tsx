import React from 'react'
import { Link } from 'react-router-dom'
import type { CareerMeeting } from '../../types/CareerAdvising'
import { formatMeetingTime, getAdvisorName } from '../../utils/career'

export default function BookingConfirmation({
  meeting,
  onViewMap,
}: {
  meeting: CareerMeeting
  onViewMap?: (locationId: number) => void
}) {
  const advisorName = getAdvisorName(meeting.advisorId)

  return (
    <div className="booking-confirmation">
      <div className="booking-confirmation-icon">✓</div>
      <h3>Meeting booked!</h3>
      <p>Your session with <strong>{advisorName}</strong> is confirmed.</p>
      <div className="section-panel" style={{ marginTop: 16, textAlign: 'left' }}>
        <div className="meta"><strong>Topic:</strong> {meeting.topic}</div>
        <div className="meta">{formatMeetingTime(meeting.startTime, meeting.endTime)}</div>
        <div className="meta">
          <strong>Format:</strong> {meeting.meetingFormat === 'online' ? 'Online' : 'In person'}
        </div>
        {meeting.meetingLink && (
          <div className="meta"><strong>Link:</strong>{' '}
            <a href={meeting.meetingLink} target="_blank" rel="noreferrer">{meeting.meetingLink}</a>
          </div>
        )}
      </div>
      <div className="card-actions" style={{ justifyContent: 'center', marginTop: 20 }}>
        <Link to="/career/my-meetings" className="btn primary">View my meetings</Link>
        {meeting.locationId && onViewMap && (
          <button type="button" className="btn" onClick={() => onViewMap(meeting.locationId!)}>View on map</button>
        )}
        <Link to="/career/directory" className="btn">Book another</Link>
      </div>
    </div>
  )
}
