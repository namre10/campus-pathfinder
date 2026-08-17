import React from 'react'
import { Link } from 'react-router-dom'
import essentialsData from '../../data/columbiaEssentials.json'
import PageHeading from '../PageHeading'

type EssentialLink = { label: string; url: string; external?: boolean }
type EssentialStep = { title: string; detail: string; links?: EssentialLink[] }
type EssentialPhase = {
  id: string
  label: string
  summary: string
  steps: EssentialStep[]
}

export default function ColumbiaEssentialsWalkthrough() {
  const phases = essentialsData.phases as EssentialPhase[]

  return (
    <div className="page-panel">
      <div className="content-panel">
        <PageHeading
          title="SSN & Missouri ID walkthrough"
          description={essentialsData.intro}
          breadcrumbs={[
            { label: 'Home', to: '/' },
            { label: 'Mizzou tools', to: '/tools' },
            { label: 'SSN & license' },
          ]}
          actions={
            <>
              <a
                href="https://international.missouri.edu/isss/living-in-columbia/identification-documents/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn primary"
              >
                Official ISSS guide ↗
              </a>
              <Link to="/tools" className="btn">All Mizzou tools</Link>
            </>
          }
        />

        <div className="section-panel essentials-disclaimer">
          <p className="meta">{essentialsData.disclaimer}</p>
        </div>

        <div className="career-timeline essentials-walkthrough">
          {phases.map((phase, index) => (
            <section key={phase.id} className="career-timeline-year">
              <div className="career-timeline-year-head">
                <h3>
                  <span className="essentials-phase-num">{index + 1}</span>
                  {phase.label}
                </h3>
              </div>
              <p className="meta">{phase.summary}</p>
              <ol className="career-timeline-steps">
                {phase.steps.map(step => (
                  <li key={step.title} className="career-timeline-step">
                    <strong>{step.title}</strong>
                    <p>{step.detail}</p>
                    {step.links && step.links.length > 0 && (
                      <div className="career-timeline-links">
                        {step.links.map(link => (
                          <a
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn compact"
                          >
                            {link.label} ↗
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>

        <div className="section-panel tools-hub-footer-note">
          <p className="meta">
            Ask Tiger Guide: &ldquo;How do I get a Social Security number?&rdquo; or &ldquo;What do I need for a Missouri driver&apos;s license?&rdquo;
          </p>
          <div className="page-actions">
            <Link to="/" className="btn primary">Ask Tiger Guide</Link>
            <Link to="/map" className="btn">Campus map</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
