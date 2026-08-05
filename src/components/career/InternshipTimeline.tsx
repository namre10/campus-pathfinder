import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import timelineData from '../../data/careerTimeline.json'
import PageHeading from '../PageHeading'
import CareerProfileForm from './CareerProfileForm'
import {
  getCareerProfile,
  getCareerGoalLabel,
  getCareerYearLabel,
  type CareerProfile,
  type CareerYear,
} from '../../utils/careerProfile'

type TimelineLink = { label: string; url: string; external?: boolean }
type TimelineStep = { title: string; detail: string; links?: TimelineLink[] }
type TimelineYear = {
  id: CareerYear
  label: string
  summary: string
  steps: TimelineStep[]
}

export default function InternshipTimeline() {
  const [profile, setProfile] = useState<CareerProfile | null>(() => getCareerProfile())

  useEffect(() => {
    function sync() {
      setProfile(getCareerProfile())
    }
    window.addEventListener('career-profile-changed', sync)
    return () => window.removeEventListener('career-profile-changed', sync)
  }, [])

  const years = timelineData.years as TimelineYear[]
  const ordered = useMemo(() => years, [years])
  const currentYearId = profile?.year

  return (
    <div className="page-panel">
      <div className="content-panel">
        <PageHeading
          title="Internship & career timeline"
          description="A year-by-year roadmap for Mizzou students — with links to Handshake, Career Center, and Mizzou Mentoring."
          breadcrumbs={[
            { label: 'Home', to: '/' },
            { label: 'Career', to: '/career' },
            { label: 'Timeline' },
          ]}
          actions={
            <>
              <Link to="/career/mentor-questions" className="btn primary">Mentor question builder</Link>
              <Link to="/career/directory" className="btn">Advisor directory</Link>
            </>
          }
        />

        <div className="section-panel career-profile-panel">
          <CareerProfileForm onSaved={() => setProfile(getCareerProfile())} />
          {profile && (
            <p className="meta career-timeline-you">
              Your year: <strong>{getCareerYearLabel(profile.year)}</strong>
              {' · '}{profile.major}
              {' · '}{getCareerGoalLabel(profile.goal)}
            </p>
          )}
        </div>

        <div className="career-timeline">
          {ordered.map(year => {
            const isCurrent = year.id === currentYearId
            return (
              <section
                key={year.id}
                className={`career-timeline-year${isCurrent ? ' career-timeline-year--current' : ''}`}
              >
                <div className="career-timeline-year-head">
                  <h3>{year.label}</h3>
                  {isCurrent && <span className="career-timeline-badge">Your year</span>}
                </div>
                <p className="meta">{year.summary}</p>
                <ol className="career-timeline-steps">
                  {year.steps.map(step => (
                    <li key={step.title} className="career-timeline-step">
                      <strong>{step.title}</strong>
                      <p>{step.detail}</p>
                      {step.links && step.links.length > 0 && (
                        <div className="career-timeline-links">
                          {step.links.map(link =>
                            link.external ? (
                              <a
                                key={link.url}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn compact"
                              >
                                {link.label} ↗
                              </a>
                            ) : (
                              <Link key={link.url} to={link.url} className="btn compact">
                                {link.label} →
                              </Link>
                            )
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
