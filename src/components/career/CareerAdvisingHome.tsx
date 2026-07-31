import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import advisorsData from '../../data/advisors'
import AdvisorCard from './AdvisorCard'
import MeetingCard from './MeetingCard'
import PageHeading from '../PageHeading'
import EmptyState from '../EmptyState'
import locations from '../../data/locations.json'
import { loadMeetings, upcomingMeetings } from '../../utils/career'

const topics = [
  { label: 'Resume review', value: 'resume review', icon: '📄' },
  { label: 'Internship search', value: 'internships', icon: '💼' },
  { label: 'Interview prep', value: 'interview preparation', icon: '🎯' },
  { label: 'Graduate school', value: 'graduate school', icon: '🎓' },
  { label: 'Networking advice', value: 'networking', icon: '🤝' },
]

export default function CareerAdvisingHome() {
  const [meetings, setMeetings] = useState([])

  useEffect(() => {
    setMeetings(loadMeetings())
  }, [])

  const upcoming = useMemo(() => upcomingMeetings(meetings).slice(0, 3), [meetings])
  const recommended = useMemo(() => advisorsData.slice(0, 3), [])

  return (
    <div className="page-panel">
      <div className="content-panel">
        <PageHeading
          title="Career Advising"
          description="Connect with professors, career advisors, and mentors — book a session to get guidance on your path."
          breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Career' }]}
          actions={
            <>
              <Link to="/career/directory" className="btn primary">Browse advisors</Link>
              <Link to="/career/my-meetings" className="btn">My meetings</Link>
            </>
          }
        />

        <div className="event-stats">
          <div className="event-stat">
            <strong>{advisorsData.length}</strong>
            <span>Advisors</span>
          </div>
          <div className="event-stat">
            <strong>{upcoming.length}</strong>
            <span>Upcoming</span>
          </div>
          <div className="event-stat">
            <strong>{advisorsData.filter(a => a.meetingFormats.includes('online')).length}</strong>
            <span>Online available</span>
          </div>
        </div>

        <div className="section-panel">
          <h3>How it works</h3>
          <div className="career-flow">
            {['Pick a topic', 'Choose an advisor', 'Select a time', 'Confirm booking', 'Find the office'].map((step, i) => (
              <div key={step} className="career-flow-step">
                <span className="career-flow-num">{i + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="section-panel">
          <h3>Explore by topic</h3>
          <div className="topic-grid">
            {topics.map(topic => (
              <Link key={topic.value} to={`/career/directory?topic=${encodeURIComponent(topic.value)}`} className="topic-card">
                <span className="topic-icon">{topic.icon}</span>
                <div>
                  <strong>{topic.label}</strong>
                  <p>Find advisors who specialize in {topic.label.toLowerCase()}.</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="section-panel">
          <h3>Recommended advisors</h3>
          <div className="card-grid">
            {recommended.map(advisor => (
              <AdvisorCard key={advisor.id} advisor={advisor} />
            ))}
          </div>
        </div>

        <div className="section-panel">
          <h3>Your upcoming meetings</h3>
          {upcoming.length === 0 ? (
            <EmptyState
              icon="📅"
              title="No meetings booked"
              description="Browse the advisor directory and book your first career session."
              actions={<Link to="/career/directory" className="btn primary">Find an advisor</Link>}
            />
          ) : (
            <div className="card-grid card-grid--single">
              {upcoming.map(meeting => {
                const loc = meeting.locationId
                  ? locations.find((l: { id: number }) => l.id === meeting.locationId)
                  : null
                return (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    locationName={loc?.name}
                    showActions={false}
                  />
                )
              })}
            </div>
          )}
          {upcoming.length > 0 && (
            <div className="card-actions" style={{ marginTop: 14 }}>
              <Link to="/career/my-meetings" className="btn">View all meetings</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
