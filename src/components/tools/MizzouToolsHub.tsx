import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toolsData from '../../data/mizzouTools.json'
import PageHeading from '../PageHeading'

type Tool = {
  name: string
  description: string
  url: string
  icon: string
  internal?: boolean
}

type Category = {
  id: string
  label: string
  tools: Tool[]
}

export default function MizzouToolsHub() {
  const categories = toolsData.categories as Category[]
  const pathfinderTools = toolsData.pathfinderTools as Tool[]
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const allOfficialCount = useMemo(
    () => categories.reduce((n, c) => n + c.tools.length, 0),
    [categories]
  )

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase()
    return categories
      .map(cat => ({
        ...cat,
        tools: cat.tools.filter(t => {
          const matchesQuery =
            !q ||
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q)
          const matchesCat = activeCategory === 'all' || cat.id === activeCategory
          return matchesQuery && matchesCat
        }),
      }))
      .filter(cat => cat.tools.length > 0)
  }, [categories, query, activeCategory])

  return (
    <div className="page-panel">
      <div className="content-panel">
        <PageHeading
          title="Mizzou tools hub"
          description={toolsData.intro}
          breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Mizzou tools' }]}
          actions={
            <>
              <Link to="/" className="btn primary">Ask Tiger Guide</Link>
              <Link to="/map" className="btn">Open map</Link>
            </>
          }
        />

        <div className="tools-hub-stats">
          <div className="event-stat">
            <strong>{allOfficialCount}</strong>
            <span>Official Mizzou links</span>
          </div>
          <div className="event-stat">
            <strong>{pathfinderTools.length}</strong>
            <span>Pathfinder features</span>
          </div>
          <div className="event-stat">
            <strong>1</strong>
            <span>Place to start</span>
          </div>
        </div>

        <div className="section-panel tools-hub-pathfinder">
          <h3>Start here — Campus Pathfinder</h3>
          <p className="meta tools-hub-note">
            These are <strong>ours</strong> — Mizzou does not bundle these together. Official apps are listed below.
          </p>
          <div className="tools-hub-grid">
            {pathfinderTools.map(tool => (
              <Link key={tool.url} to={tool.url} className="tools-hub-card tools-hub-card--pathfinder">
                <span className="tools-hub-icon">{tool.icon}</span>
                <div>
                  <strong>{tool.name}</strong>
                  <p>{tool.description}</p>
                  <span className="tools-hub-link-label">Open in Pathfinder →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="section-panel">
          <div className="tools-hub-toolbar">
            <input
              type="search"
              className="tools-hub-search"
              placeholder="Search Mizzou tools…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search Mizzou tools"
            />
            <div className="tools-hub-filters">
              <button
                type="button"
                className={`filter-chip${activeCategory === 'all' ? ' active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={`filter-chip${activeCategory === cat.id ? ' active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {filteredCategories.map(cat => (
            <div key={cat.id} className="tools-hub-category">
              <h3>{cat.label}</h3>
              <div className="tools-hub-grid">
                {cat.tools.map(tool => (
                  <a
                    key={tool.url}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tools-hub-card"
                  >
                    <span className="tools-hub-icon">{tool.icon}</span>
                    <div>
                      <strong>{tool.name}</strong>
                      <p>{tool.description}</p>
                      <span className="tools-hub-link-label">Official site ↗</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <p className="empty">No tools match your search.</p>
          )}
        </div>

        <div className="section-panel tools-hub-footer-note">
          <p className="meta">
            Campus Pathfinder is a student prototype — not an official Mizzou website.
            Always confirm policies and deadlines on the official links above or with an advisor.
          </p>
        </div>
      </div>
    </div>
  )
}
