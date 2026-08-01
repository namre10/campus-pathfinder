import React, { useMemo, useState } from 'react'

function LocationCard({ loc, onSelect, isSelected, favorites, toggleFavorite }) {
  return (
    <div
      id={`loc-${loc.id}`}
      className={`location-card${isSelected ? ' selected' : ''}`}
      onClick={() => onSelect(loc)}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <div className="loc-title">{loc.name}</div>
          <div className="loc-meta">{loc.category} · {loc.rating} ★</div>
        </div>
        <button
          type="button"
          className="btn compact btn-icon"
          aria-label={favorites.has(loc.id) ? 'Remove from favorites' : 'Add to favorites'}
          onClick={e => { e.stopPropagation(); toggleFavorite(loc.id) }}
        >
          {favorites.has(loc.id) ? '★' : '☆'}
        </button>
      </div>
      <div className="loc-tags">{loc.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
    </div>
  )
}

function HousingCard({ item, onSelect, isSelected }) {
  const walkClass = item.walkMinutes <= 8
    ? 'housing-card-walk housing-card-walk--near'
    : item.walkMinutes <= 20
      ? 'housing-card-walk'
      : 'housing-card-walk housing-card-walk--far'

  return (
    <div
      id={`housing-${item.id}`}
      className={`location-card housing-card${isSelected ? ' selected' : ''}`}
      onClick={() => onSelect(item)}
    >
      <div className="housing-card-top">
        <div>
          <div className="loc-title">{item.name}</div>
          <div className="loc-meta">{item.neighborhood} · {item.rent}</div>
        </div>
        <span className={walkClass}>{item.walkMinutes} min</span>
      </div>
      <div className="loc-tags">
        <span className="tag tag--neighborhood">{item.neighborhood}</span>
        {item.amenities.slice(0, 2).map(a => (
          <span key={a} className="tag">{a}</span>
        ))}
      </div>
    </div>
  )
}

export default function Sidebar({
  locations,
  housing = [],
  housingNeighborhoods = [],
  housingNeighborhood = 'All Columbia',
  setHousingNeighborhood,
  totalHousingCount = 0,
  category,
  setCategory,
  onSelect,
  onSelectHousing,
  favorites = new Set(),
  toggleFavorite,
  selectedId,
  selectedHousingId,
  open = true,
  onClose,
  showHousing = true,
  onHousingTabOpen,
}) {
  const [tab, setTab] = useState('campus')
  const sortedHousing = useMemo(
    () => [...housing].sort((a, b) => a.walkMinutes - b.walkMinutes),
    [housing]
  )

  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <div className="sidebar-header">
        <h3>{tab === 'housing' ? 'Columbia housing' : 'Campus locations'}</h3>
        {onClose && (
          <button type="button" className="sidebar-close" onClick={onClose}>Close</button>
        )}
      </div>

      {showHousing && totalHousingCount > 0 && (
        <div className="sidebar-tabs">
          <button
            type="button"
            className={`sidebar-tab${tab === 'campus' ? ' active' : ''}`}
            onClick={() => setTab('campus')}
          >
            Campus
          </button>
          <button
            type="button"
            className={`sidebar-tab${tab === 'housing' ? ' active' : ''}`}
            onClick={() => { setTab('housing'); onHousingTabOpen?.() }}
          >
            🏠 Columbia ({totalHousingCount})
          </button>
        </div>
      )}

      {tab === 'campus' ? (
        <>
          <div className="filters">
            <label htmlFor="category-filter">
              Category
              <select id="category-filter" value={category} onChange={e => setCategory(e.target.value)}>
                <option>All</option>
                <option>Study</option>
                <option>Classroom</option>
                <option>Dining</option>
                <option>Recreation</option>
                <option>Parking</option>
                <option>Services</option>
                <option>Transit</option>
              </select>
            </label>
          </div>
          <div className="list">
            {locations.map(l => (
              <LocationCard
                key={l.id}
                loc={l}
                onSelect={onSelect}
                isSelected={selectedId === l.id}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            ))}
            {locations.length === 0 && <div className="empty">No locations found.</div>}
          </div>
        </>
      ) : (
        <>
          <p className="sidebar-housing-note meta">
            All of Columbia — not just campus. Walk time to Mizzou Student Center shown for each listing.
          </p>
          <div className="filters">
            <label htmlFor="neighborhood-filter">
              Neighborhood
              <select
                id="neighborhood-filter"
                value={housingNeighborhood}
                onChange={e => setHousingNeighborhood?.(e.target.value)}
              >
                <option>All Columbia</option>
                {housingNeighborhoods.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="list">
            {sortedHousing.map(item => (
              <HousingCard
                key={item.id}
                item={item}
                onSelect={onSelectHousing}
                isSelected={selectedHousingId === item.id}
              />
            ))}
            {sortedHousing.length === 0 && (
              <div className="empty">No housing in this neighborhood.</div>
            )}
          </div>
        </>
      )}
    </aside>
  )
}
