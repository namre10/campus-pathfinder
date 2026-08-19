import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { welcomeNavState } from '../utils/welcomeNav'

const NAV_ITEMS = [
  { path: '/', label: 'Home', exact: true },
  { path: '/tools', label: 'Mizzou tools', exact: true },
  { path: '/map', label: 'Map', exact: true },
  { path: '/events', label: 'Events' },
  { path: '/community', label: 'Community' },
  { path: '/career', label: 'Career' },
]

function isActive(pathname, item) {
  if (item.exact) return pathname === item.path
  return pathname === item.path || pathname.startsWith(item.path + '/')
}

export default function Header({ query, setQuery, locations = [], onSelect, showSearch = true }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef(null)

  const searchResults = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term || !showSearch) return []
    return locations
      .filter(l =>
        l.name.toLowerCase().includes(term) ||
        l.tags.join(' ').toLowerCase().includes(term) ||
        l.category.toLowerCase().includes(term)
      )
      .slice(0, 6)
  }, [query, locations, showSearch])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelectResult(loc) {
    setQuery(loc.name)
    setSearchOpen(false)
    onSelect?.(loc)
  }

  function renderNavLink(item, className = 'nav-link') {
    const active = isActive(location.pathname, item)
    const go = item.path === '/' ? goHomeWithWelcome : () => navigate(item.path)
    return (
      <button
        key={item.path}
        type="button"
        className={`${className}${active ? ' active' : ''}`}
        onClick={go}
      >
        {item.label}
      </button>
    )
  }

  function goHomeWithWelcome() {
    navigate('/', { state: welcomeNavState() })
  }

  return (
    <header className="header">
      <div className="brand" onClick={goHomeWithWelcome} role="button" tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goHomeWithWelcome() } }}
        aria-label="Campus Pathfinder home — show welcome"
      >
        <span className="brand-mark">🐯</span>
        <div>
          <div>Campus Pathfinder</div>
          <small style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
            Tiger Guide · Mizzou copilot
          </small>
        </div>
      </div>

      {showSearch && (
        <div className="search" ref={searchRef}>
          <input
            aria-label="Search locations"
            placeholder="Search buildings, tags, categories..."
            value={query}
            onChange={e => { setQuery(e.target.value); setSearchOpen(true) }}
            onFocus={() => setSearchOpen(true)}
          />
          {searchOpen && searchResults.length > 0 && (
            <div className="search-dropdown">
              {searchResults.map(loc => (
                <button
                  key={loc.id}
                  type="button"
                  className="search-result"
                  onClick={() => handleSelectResult(loc)}
                >
                  <div>{loc.name}</div>
                  <div className="search-result-meta">{loc.category} · {loc.tags.slice(0, 2).join(', ')}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <nav className="nav-desktop" aria-label="Main navigation">
        {NAV_ITEMS.map(item => renderNavLink(item))}
        <span className="nav-link nav-signin" title="Coming soon">Sign in</span>
      </nav>

      <button
        type="button"
        className="menu-toggle"
        aria-expanded={menuOpen}
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(o => !o)}
      >
        {menuOpen ? '✕ Close' : '☰ Menu'}
      </button>

      <nav className={`nav-mobile${menuOpen ? ' open' : ''}`} aria-label="Mobile navigation">
        {NAV_ITEMS.map(item => renderNavLink(item))}
        <span className="nav-link nav-signin">Sign in (coming soon)</span>
      </nav>
    </header>
  )
}
