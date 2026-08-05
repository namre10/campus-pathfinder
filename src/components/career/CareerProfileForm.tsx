import React, { useEffect, useState } from 'react'
import {
  CAREER_GOALS,
  CAREER_MAJORS,
  CAREER_YEARS,
  clearCareerProfile,
  getCareerProfile,
  saveCareerProfile,
  type CareerProfile,
} from '../../utils/careerProfile'

export default function CareerProfileForm({
  compact = false,
  onSaved,
}: {
  compact?: boolean
  onSaved?: () => void
}) {
  const [open, setOpen] = useState(!compact)
  const [savedFlash, setSavedFlash] = useState(false)
  const [form, setForm] = useState<CareerProfile>(() =>
    getCareerProfile() ?? {
      major: 'Computer Science',
      year: 'sophomore',
      goal: 'internship',
    }
  )

  useEffect(() => {
    function sync() {
      const p = getCareerProfile()
      if (p) setForm(p)
    }
    window.addEventListener('career-profile-changed', sync)
    return () => window.removeEventListener('career-profile-changed', sync)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    saveCareerProfile(form)
    setSavedFlash(true)
    onSaved?.()
    window.setTimeout(() => setSavedFlash(false), 2000)
  }

  function handleClear() {
    clearCareerProfile()
    onSaved?.()
  }

  const stored = getCareerProfile()

  return (
    <div className={`career-profile-form${compact ? ' career-profile-form--compact' : ''}`}>
      {compact && (
        <button
          type="button"
          className="btn compact career-profile-toggle"
          onClick={() => setOpen(o => !o)}
        >
          {open ? 'Hide career profile' : stored ? 'Edit career profile' : 'Set career profile'}
        </button>
      )}

      {(open || !compact) && (
        <form onSubmit={handleSubmit}>
          {!compact && <strong className="career-profile-title">My career profile</strong>}
          <p className="meta career-profile-hint">
            Personalizes Tiger Guide answers and your internship timeline.
          </p>

          <label className="career-profile-field">
            <span>Major</span>
            <select
              value={form.major}
              onChange={e => setForm(f => ({ ...f, major: e.target.value }))}
            >
              {CAREER_MAJORS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>

          <label className="career-profile-field">
            <span>Year</span>
            <select
              value={form.year}
              onChange={e => setForm(f => ({ ...f, year: e.target.value as CareerProfile['year'] }))}
            >
              {CAREER_YEARS.map(y => (
                <option key={y.id} value={y.id}>{y.label}</option>
              ))}
            </select>
          </label>

          <label className="career-profile-field">
            <span>Career goal</span>
            <select
              value={form.goal}
              onChange={e => setForm(f => ({ ...f, goal: e.target.value as CareerProfile['goal'] }))}
            >
              {CAREER_GOALS.map(g => (
                <option key={g.id} value={g.id}>{g.label}</option>
              ))}
            </select>
          </label>

          <div className="career-profile-actions">
            <button type="submit" className="btn primary compact">Save profile</button>
            {stored && (
              <button type="button" className="btn compact" onClick={handleClear}>Clear</button>
            )}
          </div>
          {savedFlash && <p className="meta career-profile-saved">Profile saved.</p>}
        </form>
      )}
    </div>
  )
}
