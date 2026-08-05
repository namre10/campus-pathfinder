const STORAGE_KEY = 'campus_pathfinder_housing_favorites'

export function getHousingFavorites(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter(n => typeof n === 'number') : []
  } catch {
    return []
  }
}

export function saveHousingFavorites(ids: number[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export function toggleHousingFavorite(id: number): number[] {
  const set = new Set(getHousingFavorites())
  if (set.has(id)) set.delete(id)
  else set.add(id)
  const next = Array.from(set)
  saveHousingFavorites(next)
  window.dispatchEvent(new CustomEvent('housing-favorites-changed'))
  return next
}

export function housingFavoritesSet(): Set<number> {
  return new Set(getHousingFavorites())
}
