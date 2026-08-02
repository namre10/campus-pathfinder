import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TigerGuideChat from '../guide/TigerGuideChat'
import TigerGuideWelcome, { shouldShowWelcome } from '../guide/TigerGuideWelcome'
import { isWelcomeNavState } from '../../utils/welcomeNav'

export default function PathfinderHome() {
  const location = useLocation()
  const navigate = useNavigate()
  const navWelcome = isWelcomeNavState(location.state)

  const [showWelcome, setShowWelcome] = useState(() => navWelcome || shouldShowWelcome())
  const [welcomeKey, setWelcomeKey] = useState(() =>
    navWelcome ? (location.state as { welcomeAt: number }).welcomeAt : 0
  )

  useEffect(() => {
    if (!isWelcomeNavState(location.state)) return
    const { welcomeAt } = location.state as { welcomeAt: number }
    setShowWelcome(true)
    setWelcomeKey(welcomeAt)
    navigate(location.pathname, { replace: true, state: {} })
  }, [location.state, location.pathname, navigate])

  return (
    <div className={`page-panel pathfinder-home pathfinder-home--guide${showWelcome ? ' pathfinder-home--welcome' : ''}`}>
      {showWelcome && (
        <TigerGuideWelcome
          key={welcomeKey}
          onComplete={() => setShowWelcome(false)}
        />
      )}
      <TigerGuideChat />
    </div>
  )
}
