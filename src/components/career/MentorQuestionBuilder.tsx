import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeading from '../PageHeading'
import CareerProfileForm from './CareerProfileForm'
import {
  CAREER_GOALS,
  CAREER_MAJORS,
  CAREER_YEARS,
  getCareerProfile,
  type CareerGoal,
  type CareerYear,
} from '../../utils/careerProfile'
import { buildMentorQuestions } from '../../utils/mentorQuestions'

const MENTORING_URL = 'https://mizzou.xinspire.com/programs/mizzou'

export default function MentorQuestionBuilder() {
  const stored = getCareerProfile()
  const [major, setMajor] = useState(stored?.major ?? 'Computer Science')
  const [year, setYear] = useState<CareerYear>(stored?.year ?? 'sophomore')
  const [goal, setGoal] = useState<CareerGoal>(stored?.goal ?? 'internship')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    function sync() {
      const p = getCareerProfile()
      if (p) {
        setMajor(p.major)
        setYear(p.year)
        setGoal(p.goal)
      }
    }
    window.addEventListener('career-profile-changed', sync)
    return () => window.removeEventListener('career-profile-changed', sync)
  }, [])

  const result = useMemo(
    () => buildMentorQuestions(major, goal, year),
    [major, goal, year]
  )

  async function copyQuestions() {
    const text = [
      result.intro,
      '',
      ...result.questions.map((q, i) => `${i + 1}. ${q}`),
      '',
      result.tip,
    ].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="page-panel">
      <div className="content-panel">
        <PageHeading
          title="Mentor question builder"
          description="Generate thoughtful questions before you reach out on Mizzou Mentoring — tailored to your major and goal."
          breadcrumbs={[
            { label: 'Home', to: '/' },
            { label: 'Career', to: '/career' },
            { label: 'Mentor questions' },
          ]}
          actions={
            <>
              <a href={MENTORING_URL} target="_blank" rel="noopener noreferrer" className="btn primary">
                Open Mizzou Mentoring ↗
              </a>
              <Link to="/career/timeline" className="btn">Career timeline</Link>
            </>
          }
        />

        <div className="section-panel mentor-builder-grid">
          <div className="mentor-builder-form">
            <h3>Your context</h3>
            <label>
              Major
              <select value={major} onChange={e => setMajor(e.target.value)}>
                {CAREER_MAJORS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </label>
            <label>
              Year
              <select value={year} onChange={e => setYear(e.target.value as CareerYear)}>
                {CAREER_YEARS.map(y => (
                  <option key={y.id} value={y.id}>{y.label}</option>
                ))}
              </select>
            </label>
            <label>
              Goal
              <select value={goal} onChange={e => setGoal(e.target.value as CareerGoal)}>
                {CAREER_GOALS.map(g => (
                  <option key={g.id} value={g.id}>{g.label}</option>
                ))}
              </select>
            </label>
            <CareerProfileForm compact onSaved={() => {
              const p = getCareerProfile()
              if (p) {
                setMajor(p.major)
                setYear(p.year)
                setGoal(p.goal)
              }
            }} />
          </div>

          <div className="mentor-builder-output">
            <h3>Questions to ask</h3>
            <p>{result.intro}</p>
            <ol className="mentor-builder-questions">
              {result.questions.map(q => (
                <li key={q}>{q}</li>
              ))}
            </ol>
            <div className="guide-msg-tips mentor-builder-tip">
              <span className="guide-msg-tips-label">Tip</span>
              <p>{result.tip}</p>
            </div>
            <div className="page-actions">
              <button type="button" className="btn primary" onClick={copyQuestions}>
                {copied ? 'Copied!' : 'Copy questions'}
              </button>
              <a href={MENTORING_URL} target="_blank" rel="noopener noreferrer" className="btn">
                Find a mentor ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
