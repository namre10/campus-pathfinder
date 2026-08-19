import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TigerGuideChat from '../guide/TigerGuideChat'
import TigerGuideWelcome from '../guide/TigerGuideWelcome'
import { isWelcomeNavState } from '../../utils/welcomeNav'
import type { WelcomeIntent } from '../../utils/welcomeIntents'

export default function PathfinderHome() {
  const location = useLocation()
  const navigate = useNavigate()

  const [showWelcome, setShowWelcome] = useState(true)
  const [welcomeKey, setWelcomeKey] = useState(() => Date.now())
  const [chatIntent, setChatIntent] = useState<WelcomeIntent | null>(null)
  const prevPath = useRef(location.pathname)

  useEffect(() => {
    if (isWelcomeNavState(location.state)) {
      const { welcomeAt } = location.state as { welcomeAt: number }
      setShowWelcome(true)
      setWelcomeKey(welcomeAt)
      setChatIntent(null)
      navigate(location.pathname, { replace: true, state: {} })
      prevPath.current = location.pathname
      return
    }

    if (location.pathname === '/' && prevPath.current !== '/') {
      setShowWelcome(true)
      setWelcomeKey(Date.now())
      setChatIntent(null)
    }

    prevPath.current = location.pathname
  }, [location.pathname, location.state, navigate])

  function handleWelcomeComplete(intent?: WelcomeIntent) {
    setShowWelcome(false)
    if (intent) setChatIntent(intent)
  }

  return (
    <div className={`page-panel pathfinder-home pathfinder-home--guide${showWelcome ? ' pathfinder-home--welcome' : ''}`}>
      {showWelcome && (
        <TigerGuideWelcome
          key={welcomeKey}
          onComplete={handleWelcomeComplete}
        />
      )}
      <TigerGuideChat intent={chatIntent} onIntentHandled={() => setChatIntent(null)} />
    </div>
  )
}
