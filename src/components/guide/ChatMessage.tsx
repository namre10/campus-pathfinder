import React from 'react'
import { Link } from 'react-router-dom'
import type { GuideLink } from '../../utils/tigerGuide'

export type ChatMessageData = {
  id: string
  role: 'user' | 'assistant'
  text?: string
  response?: {
    title: string
    answer: string
    steps: string[]
    links: GuideLink[]
    tips: string[]
    matched: boolean
  }
  typing?: boolean
}

function GuideLinks({ links }: { links: GuideLink[] }) {
  if (!links.length) return null
  return (
    <div className="guide-msg-links">
      {links.map(link => {
        const className = 'btn compact guide-msg-link'
        if (link.external) {
          return (
            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className={className}>
              {link.label} ↗
            </a>
          )
        }
        return (
          <Link key={link.url} to={link.url} className={className}>
            {link.label} →
          </Link>
        )
      })}
    </div>
  )
}

export default function ChatMessage({ message }: { message: ChatMessageData }) {
  if (message.role === 'user') {
    return (
      <div className="guide-msg guide-msg--user">
        <div className="guide-msg-bubble">{message.text}</div>
      </div>
    )
  }

  if (message.typing) {
    return (
      <div className="guide-msg guide-msg--assistant">
        <div className="guide-msg-avatar" aria-hidden>🐯</div>
        <div className="guide-msg-bubble guide-msg-bubble--typing">
          <span className="guide-typing-dot" />
          <span className="guide-typing-dot" />
          <span className="guide-typing-dot" />
        </div>
      </div>
    )
  }

  const r = message.response
  if (!r) return null

  return (
    <div className="guide-msg guide-msg--assistant">
      <div className="guide-msg-avatar" aria-hidden>🐯</div>
      <div className="guide-msg-bubble">
        <strong className="guide-msg-title">{r.title}</strong>
        <p>{r.answer}</p>
        {r.steps.length > 0 && (
          <ol className="guide-msg-steps">
            {r.steps.map(step => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        )}
        {r.tips.length > 0 && (
          <div className="guide-msg-tips">
            <span className="guide-msg-tips-label">Questions to ask:</span>
            <ul>
              {r.tips.map(tip => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
        <GuideLinks links={r.links} />
        {!r.matched && (
          <p className="meta guide-msg-disclaimer">Prototype only — confirm with an advisor or official Mizzou office.</p>
        )}
      </div>
    </div>
  )
}
