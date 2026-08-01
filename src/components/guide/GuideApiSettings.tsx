import React, { useState } from 'react'
import {
  getGeminiApiKey,
  getLlmModelLabel,
  isLlmConfigured,
  saveGeminiApiKey,
} from '../../utils/tigerGuideLlm'

export default function GuideApiSettings({
  onSaved,
}: {
  onSaved?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [key, setKey] = useState(() => getGeminiApiKey())
  const [saved, setSaved] = useState(false)
  const configured = isLlmConfigured()

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    saveGeminiApiKey(key)
    setSaved(true)
    onSaved?.()
    window.setTimeout(() => setSaved(false), 2000)
  }

  function clearKey() {
    saveGeminiApiKey('')
    setKey('')
    onSaved?.()
  }

  return (
    <div className="guide-api-settings">
      <div className={`guide-api-badge${configured ? ' guide-api-badge--on' : ''}`}>
        {configured ? `● ${getLlmModelLabel()}` : '○ Mock mode (no Gemini key)'}
      </div>
      <button
        type="button"
        className="btn compact guide-api-toggle"
        onClick={() => setOpen(o => !o)}
      >
        {open ? 'Hide API settings' : 'Gemini API key (free)'}
      </button>
      {open && (
        <form className="guide-api-form" onSubmit={handleSave}>
          <label className="guide-api-label">
            <span>Google Gemini API key</span>
            <input
              type="password"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="AIza..."
              autoComplete="off"
            />
          </label>
          <p className="meta guide-api-hint">
            Free at{' '}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
              Google AI Studio
            </a>
            . Stored in your browser only, or set <code>VITE_GEMINI_API_KEY</code> in <code>.env</code>.
          </p>
          <div className="guide-api-actions">
            <button type="submit" className="btn primary compact">Save key</button>
            <button type="button" className="btn compact" onClick={clearKey}>Clear</button>
          </div>
          {saved && <p className="meta guide-api-saved">Key saved — try asking a question.</p>}
        </form>
      )}
    </div>
  )
}
