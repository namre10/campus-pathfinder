import React, { useState } from 'react'
import TigerGuideChat from '../guide/TigerGuideChat'
import TigerGuideWelcome, { shouldShowWelcome } from '../guide/TigerGuideWelcome'

export default function PathfinderHome() {
  const [showWelcome, setShowWelcome] = useState(() => shouldShowWelcome())

  return (
    <div className={`page-panel pathfinder-home pathfinder-home--guide${showWelcome ? ' pathfinder-home--welcome' : ''}`}>
      {showWelcome && (
        <TigerGuideWelcome onComplete={() => setShowWelcome(false)} />
      )}
      <TigerGuideChat />
    </div>
  )
}
