import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ChatMessage, { type ChatMessageData } from './ChatMessage'
import GuideApiSettings from './GuideApiSettings'
import { getSuggestedPrompts } from '../../utils/tigerGuide'
import {
  askTigerGuideLlm,
  isLlmConfigured,
  type ChatTurn,
} from '../../utils/tigerGuideLlm'

const WELCOME: ChatMessageData = {
  id: 'welcome',
  role: 'assistant',
  response: {
    title: 'Welcome to Tiger Guide',
    answer: 'Ask anything about holds, registration, Stellic, jobs, alumni mentoring, or housing. I\'ll explain in plain English and link you to the right Mizzou tool.',
    steps: [],
    links: [
      { label: 'Columbia housing map', url: '/map', external: false },
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

export default function TigerGuideChat() {
  const [messages, setMessages] = useState<ChatMessageData[]>([WELCOME])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [llmOn, setLlmOn] = useState(() => isLlmConfigured())
  const [statusNote, setStatusNote] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const prompts = getSuggestedPrompts()

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

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

        <div className="tiger-guide-sidebar-links">
          <Link to="/map" className="btn">Columbia map</Link>
          <Link to="/events" className="btn">Events</Link>
          <Link to="/career" className="btn">Career</Link>
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
