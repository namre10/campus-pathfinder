import L from 'leaflet'

export const CATEGORY_CONFIG = {
  Study:       { emoji: '📚', color: '#2563eb', label: 'Study' },
  Classroom:   { emoji: '🏫', color: '#7c3aed', label: 'Classroom' },
  Dining:      { emoji: '🍽️', color: '#ea580c', label: 'Dining' },
  Recreation:  { emoji: '🏋️', color: '#16a34a', label: 'Recreation' },
  Parking:     { emoji: '🅿️', color: '#64748b', label: 'Parking' },
  Services:    { emoji: '🛎️', color: '#0891b2', label: 'Services' },
  Transit:     { emoji: '🚌', color: '#ca8a04', label: 'Transit' },
  default:     { emoji: '📍', color: '#ffb612', label: 'Location' },
}

export function getCategoryConfig(category) {
  return CATEGORY_CONFIG[category] || CATEGORY_CONFIG.default
}

export function createLocationIcon(category, { selected = false } = {}) {
  const cfg = getCategoryConfig(category)
  const size = selected ? 40 : 32
  const border = selected ? '3px solid #111' : '2px solid #fff'
  const shadow = selected
    ? '0 0 0 3px rgba(255,182,18,0.6), 0 4px 12px rgba(0,0,0,0.25)'
    : '0 2px 8px rgba(0,0,0,0.2)'

  return L.divIcon({
    className: 'cp-marker',
    html: `<div class="cp-marker-pin${selected ? ' cp-marker-pin--selected' : ''}" style="
      background:${cfg.color};
      width:${size}px;height:${size}px;
      border:${border};
      box-shadow:${shadow};
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
    "><span style="transform:rotate(45deg);font-size:${selected ? 16 : 13}px;line-height:1">${cfg.emoji}</span></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size + 4],
  })
}

export function createEventIcon() {
  return L.divIcon({
    className: 'cp-event-marker',
    html: `<div class="cp-event-pin" style="
      background:#7b2ff7;
      color:white;
      width:28px;height:28px;
      border:2px solid #fff;
      border-radius:8px;
      box-shadow:0 2px 8px rgba(0,0,0,0.2);
      display:flex;align-items:center;justify-content:center;
      font-size:14px;
    ">🎫</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  })
}

export function buildLocationPopupHtml(loc) {
  const cfg = getCategoryConfig(loc.category)
  return `
    <div class="map-popup">
      <div class="map-popup-category" style="color:${cfg.color}">${cfg.emoji} ${loc.category}</div>
      <div class="map-popup-title">${loc.name}</div>
      <div class="map-popup-meta">${loc.rating} ★ · ${loc.hours || 'Hours N/A'}</div>
      <div class="map-popup-tags">${loc.tags.slice(0, 3).map(t => `<span class="map-popup-tag">${t}</span>`).join('')}</div>
      <button type="button" class="map-popup-btn" data-action="details" data-loc-id="${loc.id}">View details →</button>
    </div>
  `
}

export function buildEventPopupHtml(ev, locName) {
  return `
    <div class="map-popup">
      <div class="map-popup-category" style="color:#7b2ff7">🎫 Event</div>
      <div class="map-popup-title">${ev.title}</div>
      <div class="map-popup-meta">${new Date(ev.startTime).toLocaleString()}</div>
      ${locName ? `<div class="map-popup-meta">📍 ${locName}</div>` : ''}
      <button type="button" class="map-popup-btn" data-action="event" data-event-id="${ev.id}">View event →</button>
    </div>
  `
}
