import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ChatMessage, { type ChatMessageData } from './ChatMessage'
import GuideApiSettings from './GuideApiSettings'
import CareerProfileForm from '../career/CareerProfileForm'
import { getCareerProfile, getCareerGoalLabel, getCareerYearLabel } from '../../utils/careerProfile'
import { getSuggestedPrompts } from '../../utils/tigerGuide'
import {
  askTigerGuideLlm,
  isLlmConfigured,
  type ChatTurn,
} from '../../utils/tigerGuideLlm'
import { buildHousingMapUrl, getAllHousing } from '../../utils/housing'
import { getHousingFavorites } from '../../utils/housingFavorites'
import type { WelcomeIntent } from '../../utils/welcomeIntents'

const WELCOME: ChatMessageData = {
  id: 'welcome',
  role: 'assistant',
  response: {
    title: 'Welcome to Tiger Guide',
    answer: 'Ask anything about holds, registration, Stellic, jobs, alumni mentoring, or housing. I\'ll explain in plain English and link you to the right Mizzou tool.',
    steps: [],
    links: [
      { label: 'Housing map (near campus)', url: buildHousingMapUrl({ maxWalk: 15 }), external: false },
      { label: 'Stellic', url: 'https://stellic.missouri.edu', external: true },
    ],
    tips: [],
    matched: true,
  },
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function historyFromMessages(messages: ChatMessageData[]): ChatTurn[] {
  return messages
    .filter(m => !m.typing && m.id !== 'welcome')
    .map(m => {
      if (m.role === 'user') return { role: 'user' as const, content: m.text ?? '' }
      const parts = [m.response?.title, m.response?.answer].filter(Boolean)
      return { role: 'assistant' as const, content: parts.join(': ') }
    })
    .filter(m => m.content.trim())
}

export default function TigerGuideChat({
  intent,
  onIntentHandled,
}: {
  intent?: WelcomeIntent | null
  onIntentHandled?: () => void
}) {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<ChatMessageData[]>([WELCOME])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [llmOn, setLlmOn] = useState(() => isLlmConfigured())
  const [statusNote, setStatusNote] = useState<string | null>(null)
  const [favVersion, setFavVersion] = useState(0)
  const [profileVersion, setProfileVersion] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const intentHandledRef = useRef<string | null>(null)
  const prompts = getSuggestedPrompts()

  const savedHousing = useMemo(() => {
    void favVersion
    const ids = new Set(getHousingFavorites())
    return getAllHousing().filter(h => ids.has(h.id)).slice(0, 5)
  }, [favVersion])

  const careerProfile = useMemo(() => {
    void profileVersion
    return getCareerProfile()
  }, [profileVersion])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  useEffect(() => {
    function onFavChange() {
      setFavVersion(v => v + 1)
    }
    function onProfileChange() {
      setProfileVersion(v => v + 1)
    }
    window.addEventListener('storage', onFavChange)
    window.addEventListener('housing-favorites-changed', onFavChange)
    window.addEventListener('career-profile-changed', onProfileChange)
    return () => {
      window.removeEventListener('storage', onFavChange)
      window.removeEventListener('housing-favorites-changed', onFavChange)
      window.removeEventListener('career-profile-changed', onProfileChange)
    }
  }, [])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || busy) return

    const userMsg: ChatMessageData = { id: uid(), role: 'user', text: trimmed }
    const typingId = uid()
    setMessages(prev => [...prev, userMsg, { id: typingId, role: 'assistant', typing: true }])
    setInput('')
    setBusy(true)
    setStatusNote(null)

    const history = historyFromMessages(messages)
    const { response, source, error } = await askTigerGuideLlm(trimmed, history)

    setMessages(prev => [
      ...prev.filter(m => m.id !== typingId),
      {
        id: uid(),
        role: 'assistant',
        response: {
          title: response.title + (source === 'llm' ? '' : ''),
          answer: response.answer,
          steps: response.steps,
          links: response.links,
          tips: response.tips,
          matched: response.matched,
        },
      },
    ])

    if (error) setStatusNote(error)
    else if (source === 'llm') setStatusNote(null)

    setBusy(false)
    inputRef.current?.focus()
  }

  useEffect(() => {
    if (!intent || intentHandledRef.current === intent.id) return
    intentHandledRef.current = intent.id
    if (intent.mapUrl) {
      navigate(intent.mapUrl)
    } else {
      void send(intent.prompt)
    }
    onIntentHandled?.()
  }, [intent, navigate, onIntentHandled])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    send(input)
  }

  return (
    <div className="tiger-guide">
      <aside className="tiger-guide-sidebar">
        <div className="tiger-guide-sidebar-head">
          <span className="tiger-guide-logo">🐯</span>
          <div>
            <strong>Tiger Guide</strong>
            <p className="meta">Mizzou AI copilot · Pathfinders</p>
          </div>
        </div>
        <p className="tiger-guide-sidebar-copy">
          Mizzou has Stellic, MizzouOne, Handshake, and more — but no single conversation. Tiger Guide routes you to the right place.
        </p>

        <GuideApiSettings onSaved={() => setLlmOn(isLlmConfigured())} />

        <CareerProfileForm compact onSaved={() => setProfileVersion(v => v + 1)} />

        {careerProfile && (
          <p className="meta tiger-guide-career-summary">
            Career: {getCareerYearLabel(careerProfile.year)} · {careerProfile.major} · {getCareerGoalLabel(careerProfile.goal)}
          </p>
        )}

        <div className="tiger-guide-career-links">
          <Link to="/tools" className="btn compact">All Mizzou tools</Link>
          <Link to="/career/timeline" className="btn compact">Career timeline</Link>
          <Link to="/career/mentor-questions" className="btn compact">Mentor questions</Link>
        </div>

          <div className="tiger-guide-saved-housing">
            <strong>Saved apartments ({savedHousing.length})</strong>
            {savedHousing.length > 0 ? (
              <>
                <ul>
                  {savedHousing.map(h => (
                    <li key={h.id}>
                      <Link to={`/housing/${h.id}`}>{h.name}</Link>
                      <span className="meta">{h.walkMinutes} min walk</span>
                    </li>
                  ))}
                </ul>
                <Link to={buildHousingMapUrl({ favorites: true })} className="btn compact">
                  All saved on map →
                </Link>
              </>
            ) : (
              <p className="meta tiger-guide-saved-empty">
                None yet — go to <Link to="/map?housing=1&tab=housing">Map → Columbia</Link>, open a listing, tap ♡ Save.
              </p>
            )}
          </div>

        <div className="tiger-guide-sidebar-links">
          <Link to={buildHousingMapUrl({ maxWalk: 15 })} className="btn">Housing map</Link>
          <Link to="/career/timeline" className="btn">Career hub</Link>
          <Link to="/events" className="btn">Events</Link>
        </div>
        <p className="meta tiger-guide-prototype-note">
          {llmOn
            ? 'Powered by Google Gemini (free tier) + Mizzou knowledge base. Not official Mizzou policy.'
            : 'Mock mode — add a free Gemini key in settings for live AI.'}
        </p>
      </aside>

      <div className="tiger-guide-main">
        {statusNote && (
          <div className="tiger-guide-status" role="status">
            {statusNote}
          </div>
        )}
        <div className="tiger-guide-messages" ref={scrollRef}>
          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </div>

        <div className="tiger-guide-prompts">
          {prompts.map(prompt => (
            <button
              key={prompt}
              type="button"
              className="tiger-guide-prompt"
              disabled={busy}
              onClick={() => send(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        <form className="tiger-guide-input-row" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={llmOn ? 'Ask Tiger Guide anything…' : 'Ask (mock mode) or add Gemini key…'}
            disabled={busy}
            aria-label="Message Tiger Guide"
          />
          <button type="submit" className="btn primary" disabled={busy || !input.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
