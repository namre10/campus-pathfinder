import React, { useEffect, useState } from 'react'

const STORAGE_KEY = 'tiger_guide_welcome_seen'

const PORTALS = [
  { label: 'Stellic', delay: 0.9 },
  { label: 'MizzouOne', delay: 1.05 },
  { label: 'Handshake', delay: 1.2 },
  { label: 'Housing', delay: 1.35 },
]

export function shouldShowWelcome() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) !== '1'
  } catch {
    return true
  }
}

export function markWelcomeSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* ignore */
  }
}

export default function TigerGuideWelcome({ onComplete }: { onComplete: () => void }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    document.body.classList.add('welcome-open')
    return () => document.body.classList.remove('welcome-open')
  }, [])

  function dismiss() {
    if (exiting) return
    setExiting(true)
    markWelcomeSeen()
    window.setTimeout(onComplete, 650)
  }

  return (
    <div
      className={`tiger-welcome${exiting ? ' tiger-welcome--exit' : ''}`}
      role="dialog"
      aria-labelledby="tiger-welcome-title"
      aria-modal="true"
    >
      <div className="tiger-welcome-bg" aria-hidden>
        <span className="tiger-welcome-orb tiger-welcome-orb--1" />
        <span className="tiger-welcome-orb tiger-welcome-orb--2" />
        <span className="tiger-welcome-orb tiger-welcome-orb--3" />
        <div className="tiger-welcome-grid" />
      </div>

      <div className="tiger-welcome-content">
        <div className="tiger-welcome-badge tiger-welcome-animate" style={{ animationDelay: '0.1s' }}>
          University of Missouri
        </div>

        <div className="tiger-welcome-logo-wrap tiger-welcome-animate" style={{ animationDelay: '0.25s' }}>
          <span className="tiger-welcome-logo-ring" aria-hidden />
          <span className="tiger-welcome-logo">🐯</span>
        </div>

        <h1 id="tiger-welcome-title" className="tiger-welcome-title tiger-welcome-animate" style={{ animationDelay: '0.45s' }}>
          Welcome, Mizzou Students
        </h1>

        <p className="tiger-welcome-subtitle tiger-welcome-animate" style={{ animationDelay: '0.6s' }}>
          <strong>Tiger Guide</strong> is your AI campus copilot — one conversation that connects you to
          the tools you already use.
        </p>

        <div className="tiger-welcome-portals" aria-label="Connected Mizzou tools">
          {PORTALS.map(p => (
            <span
              key={p.label}
              className="tiger-welcome-portal tiger-welcome-animate"
              style={{ animationDelay: `${p.delay}s` }}
            >
              {p.label}
            </span>
          ))}
        </div>

        <div className="tiger-welcome-hub tiger-welcome-animate" style={{ animationDelay: '1.5s' }} aria-hidden>
          <span className="tiger-welcome-hub-core">Guide</span>
        </div>

        <div className="tiger-welcome-actions tiger-welcome-animate" style={{ animationDelay: '1.65s' }}>
          <button type="button" className="btn primary tiger-welcome-cta" onClick={dismiss}>
            Get started
          </button>
          <button type="button" className="tiger-welcome-skip" onClick={dismiss}>
            Skip intro
          </button>
        </div>

        <p className="tiger-welcome-footnote tiger-welcome-animate" style={{ animationDelay: '1.8s' }}>
          Holds · Registration · Jobs · Mentors · Housing
        </p>
      </div>
    </div>
  )
}
