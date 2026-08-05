import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TigerGuideChat from '../guide/TigerGuideChat'
import TigerGuideWelcome from '../guide/TigerGuideWelcome'
import { isWelcomeNavState } from '../../utils/welcomeNav'
import type { WelcomeIntent } from '../../utils/welcomeIntents'

export default function PathfinderHome() {
  const location = useLocation()
  const navigate = useNavigate()
  const navWelcome = isWelcomeNavState(location.state)

  const [showWelcome, setShowWelcome] = useState(() => navWelcome)
  const [welcomeKey, setWelcomeKey] = useState(() =>
    navWelcome ? (location.state as { welcomeAt: number }).welcomeAt : 0
  )
  const [chatIntent, setChatIntent] = useState<WelcomeIntent | null>(null)

  useEffect(() => {
    if (!isWelcomeNavState(location.state)) return
    const { welcomeAt } = location.state as { welcomeAt: number }
    setShowWelcome(true)
    setWelcomeKey(welcomeAt)
    setChatIntent(null)
    navigate(location.pathname, { replace: true, state: {} })
  }, [location.state, location.pathname, navigate])

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
