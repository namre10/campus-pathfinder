import React from 'react'
import { Advisor } from '../../types/CareerAdvising'
import { Link } from 'react-router-dom'

const providerLabels: Record<string, string> = {
  professor: 'Professor',
  career_advisor: 'Career Advisor',
  academic_advisor: 'Academic Advisor',
  alumni: 'Alumni Mentor',
  industry_mentor: 'Industry Mentor',
}

export default function AdvisorCard({ advisor }: { advisor: Advisor }) {
  const initials = advisor.name.split(' ').map(w => w[0]).join('').slice(0, 2)

  return (
    <div className="advisor-card">
      <div className="advisor-card-header">
        <div className="advisor-avatar">{initials}</div>
        <div>
          <Link to={`/career/advisor/${advisor.id}`} className="card-title-link">{advisor.name}</Link>
          <div className="meta">{advisor.role} · {advisor.department}</div>
        </div>
      </div>
      <div className="card-body">{advisor.bio}</div>
      <div className="label-group">
        {advisor.expertise.slice(0, 3).map(t => <span key={t} className="label-chip">{t}</span>)}
        {advisor.expertise.length > 3 && <span className="label-chip">+{advisor.expertise.length - 3} more</span>}
      </div>
      <div className="label-group">
        <span className="label-chip">{providerLabels[advisor.providerType] || 'Mentor'}</span>
        {advisor.meetingFormats.map(format => (
          <span key={format} className="label-chip">{format === 'in_person' ? 'In person' : 'Online'}</span>
        ))}
      </div>
      <div className="card-actions">
        <Link to={`/career/advisor/${advisor.id}`} className="btn primary">View availability</Link>
      </div>
    </div>
  )
}
