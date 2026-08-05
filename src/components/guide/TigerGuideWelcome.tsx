import React, { useEffect, useState } from 'react'
import { WELCOME_INTENTS, type WelcomeIntent } from '../../utils/welcomeIntents'

const PORTALS = [
  { label: 'Stellic', delay: 0.9 },
  { label: 'MizzouOne', delay: 1.05 },
  { label: 'Handshake', delay: 1.2 },
  { label: 'Housing', delay: 1.35 },
]

const TOOL_MAP_NODES = [
  { id: 'stellic', label: 'Stellic', x: 12, y: 28 },
  { id: 'mizzouone', label: 'MizzouOne', x: 88, y: 28 },
  { id: 'handshake', label: 'Handshake', x: 12, y: 72 },
  { id: 'housing', label: 'Housing map', x: 88, y: 72 },
]

export default function TigerGuideWelcome({
  onComplete,
}: {
  onComplete: (intent?: WelcomeIntent) => void
}) {
  const [exiting, setExiting] = useState(false)
  const [selectedIntent, setSelectedIntent] = useState<WelcomeIntent | null>(null)

  useEffect(() => {
    document.body.classList.add('welcome-open')
    return () => document.body.classList.remove('welcome-open')
  }, [])

  function dismiss(intent?: WelcomeIntent) {
    if (exiting) return
    setExiting(true)
    const chosen = intent ?? selectedIntent ?? undefined
    window.setTimeout(() => onComplete(chosen), 650)
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

        <div className="tiger-welcome-toolmap tiger-welcome-animate" style={{ animationDelay: '0.75s' }} aria-hidden>
          <svg className="tiger-welcome-toolmap-svg" viewBox="0 0 100 100">
            {TOOL_MAP_NODES.map(node => (
              <line
                key={`line-${node.id}`}
                className="tiger-welcome-toolmap-line"
                x1="50"
                y1="50"
                x2={node.x}
                y2={node.y}
              />
            ))}
            <circle className="tiger-welcome-toolmap-core" cx="50" cy="50" r="9" />
            {TOOL_MAP_NODES.map((node, i) => (
              <g key={node.id}>
                <circle
                  className="tiger-welcome-toolmap-node"
                  cx={node.x}
                  cy={node.y}
                  r="7"
                  style={{ animationDelay: `${0.2 + i * 0.15}s` }}
                />
              </g>
            ))}
          </svg>
          <div className="tiger-welcome-toolmap-labels">
            <span className="tiger-welcome-toolmap-center">Tiger Guide</span>
            {TOOL_MAP_NODES.map(node => (
              <span
                key={node.id}
                className={`tiger-welcome-toolmap-label tiger-welcome-toolmap-label--${node.id}`}
              >
                {node.label}
              </span>
            ))}
          </div>
        </div>

        <p className="tiger-welcome-intent-label tiger-welcome-animate" style={{ animationDelay: '0.9s' }}>
          What do you need help with?
        </p>

        <div className="tiger-welcome-intents tiger-welcome-animate" style={{ animationDelay: '1s' }}>
          {WELCOME_INTENTS.map(intent => (
            <button
              key={intent.id}
              type="button"
              className={`tiger-welcome-intent${selectedIntent?.id === intent.id ? ' tiger-welcome-intent--selected' : ''}`}
              onClick={() => setSelectedIntent(intent)}
            >
              <span className="tiger-welcome-intent-icon">{intent.icon}</span>
              <span>{intent.label}</span>
            </button>
          ))}
        </div>

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

        <div className="tiger-welcome-actions tiger-welcome-animate" style={{ animationDelay: '1.65s' }}>
          <button
            type="button"
            className="btn primary tiger-welcome-cta"
            onClick={() => dismiss(selectedIntent ?? undefined)}
          >
            {selectedIntent ? `Start: ${selectedIntent.label}` : 'Get started'}
          </button>
          <button type="button" className="tiger-welcome-skip" onClick={() => dismiss()}>
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
