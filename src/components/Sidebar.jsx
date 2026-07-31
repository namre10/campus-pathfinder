import React from 'react'

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

export default function Sidebar({
  locations,
  category,
  setCategory,
  onSelect,
  favorites = new Set(),
  toggleFavorite,
  selectedId,
  open = true,
  onClose,
}) {
  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <div className="sidebar-header">
        <h3>Locations</h3>
        {onClose && (
          <button type="button" className="sidebar-close" onClick={onClose}>Close</button>
        )}
      </div>
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
    </aside>
  )
}
