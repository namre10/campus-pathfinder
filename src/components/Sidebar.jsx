import React, { useEffect, useMemo, useState } from 'react'
import HousingComparePanel from './HousingComparePanel'

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

function HousingCard({
  item,
  onSelect,
  isSelected,
  isFavorite,
  onToggleFavorite,
  isCompare,
  onToggleCompare,
}) {
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
        <div className="housing-card-actions">
          <button
            type="button"
            className="btn compact btn-icon"
            aria-label={isFavorite ? 'Remove from saved apartments' : 'Save apartment'}
            onClick={e => { e.stopPropagation(); onToggleFavorite?.(item.id) }}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
          <button
            type="button"
            className={`btn compact housing-compare-btn${isCompare ? ' housing-compare-btn--on' : ''}`}
            aria-label={isCompare ? 'Remove from compare' : 'Add to compare'}
            onClick={e => { e.stopPropagation(); onToggleCompare?.(item.id) }}
          >
            ⇄
          </button>
          <span className={walkClass}>{item.walkMinutes} min</span>
        </div>
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
  savedHousingItems = [],
  housingNeighborhoods = [],
  housingNeighborhood = 'All Columbia',
  setHousingNeighborhood,
  housingMaxRent = '',
  setHousingMaxRent,
  housingMinBeds = '',
  setHousingMinBeds,
  housingMaxWalk = '',
  setHousingMaxWalk,
  housingFavoritesOnly = false,
  setHousingFavoritesOnly,
  housingFavorites = new Set(),
  toggleHousingFavorite,
  housingCompareIds = [],
  toggleHousingCompare,
  housingCompareItems = [],
  onClearHousingCompare,
  initialHousingTab = false,
  savedTabPulse = 0,
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
  const [tab, setTab] = useState(initialHousingTab ? 'housing' : 'campus')

  useEffect(() => {
    if (initialHousingTab) setTab('housing')
  }, [initialHousingTab])

  useEffect(() => {
    if (savedTabPulse > 0) setTab('saved')
  }, [savedTabPulse])

  const sortedHousing = useMemo(
    () => [...housing].sort((a, b) => a.walkMinutes - b.walkMinutes),
    [housing]
  )

  const sortedSaved = useMemo(
    () => [...savedHousingItems].sort((a, b) => a.walkMinutes - b.walkMinutes),
    [savedHousingItems]
  )

  const tabTitle =
    tab === 'saved' ? 'Saved apartments' : tab === 'housing' ? 'Columbia housing' : 'Campus locations'

  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <div className="sidebar-header">
        <h3>{tabTitle}</h3>
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
          <button
            type="button"
            className={`sidebar-tab sidebar-tab--saved${tab === 'saved' ? ' active' : ''}`}
            onClick={() => setTab('saved')}
          >
            ♥ Saved ({housingFavorites.size})
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
      ) : tab === 'saved' ? (
        <>
          <p className="sidebar-housing-note meta">
            Apartments you saved with ♥. Also visible on <strong>Home → Tiger Guide sidebar</strong>.
          </p>
          <div className="list">
            {sortedSaved.map(item => (
              <HousingCard
                key={item.id}
                item={item}
                onSelect={onSelectHousing}
                isSelected={selectedHousingId === item.id}
                isFavorite={true}
                onToggleFavorite={toggleHousingFavorite}
                isCompare={housingCompareIds.includes(item.id)}
                onToggleCompare={toggleHousingCompare}
              />
            ))}
            {sortedSaved.length === 0 && (
              <div className="empty">
                No saved apartments yet. On the Columbia tab, tap ♡ on any listing to save it.
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="sidebar-housing-note meta">
            Filter by budget, bedrooms, and walk time. Save ♥ or compare ⇄ up to 3 apartments.
          </p>
          <div className="filters housing-filters">
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
            <label htmlFor="max-rent-filter">
              Max rent / mo
              <select
                id="max-rent-filter"
                value={housingMaxRent}
                onChange={e => setHousingMaxRent?.(e.target.value)}
              >
                <option value="">Any</option>
                <option value="900">Under $900</option>
                <option value="1100">Under $1,100</option>
                <option value="1300">Under $1,300</option>
                <option value="1600">Under $1,600</option>
              </select>
            </label>
            <label htmlFor="min-beds-filter">
              Min bedrooms
              <select
                id="min-beds-filter"
                value={housingMinBeds}
                onChange={e => setHousingMinBeds?.(e.target.value)}
              >
                <option value="">Any</option>
                <option value="1">1+ bed</option>
                <option value="2">2+ bed</option>
                <option value="3">3+ bed</option>
                <option value="4">4+ bed</option>
              </select>
            </label>
            <label htmlFor="max-walk-filter">
              Max walk to campus
              <select
                id="max-walk-filter"
                value={housingMaxWalk}
                onChange={e => setHousingMaxWalk?.(e.target.value)}
              >
                <option value="">Any</option>
                <option value="10">10 min</option>
                <option value="15">15 min</option>
                <option value="20">20 min</option>
                <option value="30">30 min</option>
              </select>
            </label>
            <label className="housing-fav-filter">
              <input
                type="checkbox"
                checked={housingFavoritesOnly}
                onChange={e => setHousingFavoritesOnly?.(e.target.checked)}
              />
              Saved only ({housingFavorites.size})
            </label>
          </div>

          {housingCompareItems.length >= 2 && (
            <HousingComparePanel
              items={housingCompareItems}
              onRemove={toggleHousingCompare}
              onClear={onClearHousingCompare}
            />
          )}

          <div className="list">
            {sortedHousing.map(item => (
              <HousingCard
                key={item.id}
                item={item}
                onSelect={onSelectHousing}
                isSelected={selectedHousingId === item.id}
                isFavorite={housingFavorites.has(item.id)}
                onToggleFavorite={toggleHousingFavorite}
                isCompare={housingCompareIds.includes(item.id)}
                onToggleCompare={toggleHousingCompare}
              />
            ))}
            {sortedHousing.length === 0 && (
              <div className="empty">No housing matches these filters.</div>
            )}
          </div>
        </>
      )}
    </aside>
  )
}
