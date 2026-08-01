import React from 'react'
import { Link } from 'react-router-dom'

const links = [
  { to: '/map', icon: '🗺️', title: 'Campus map', desc: 'Find buildings, get directions, and save favorites.' },
  { to: 'https://stellic.missouri.edu', icon: '📋', title: 'Stellic', desc: 'Degree audit and semester planning.', external: true },
  { to: '/events', icon: '📅', title: 'Events', desc: 'Browse campus events and save opportunities.' },
  { to: '/career', icon: '🎯', title: 'Career advising', desc: 'Book meetings with mentors and advisors.' },
  { to: '/community', icon: '👥', title: 'Communities', desc: 'Join clubs and student interest groups.' },
]

export default function DashboardQuickLinks() {
  return (
    <div className="topic-grid dashboard-quick-links">
      {links.map(link => {
        if (link.external) {
          return (
            <a key={link.to} href={link.to} target="_blank" rel="noreferrer" className="topic-card">
              <span className="topic-icon">{link.icon}</span>
              <div>
                <strong>{link.title}</strong>
                <p>{link.desc}</p>
              </div>
            </a>
          )
        }
        return (
          <Link key={link.to} to={link.to} className="topic-card">
            <span className="topic-icon">{link.icon}</span>
            <div>
              <strong>{link.title}</strong>
              <p>{link.desc}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
