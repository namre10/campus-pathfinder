import housingData from '../data/housing.json'
import { distanceKm } from './geo'

export type HousingItem = {
  id: number
  name: string
  neighborhood: string
  address: string
  lat: number
  lng: number
  beds: string
  rent: string
  amenities: string[]
  description: string
  listingUrl: string
  phone: string | null
}

export type HousingWithCommute = HousingItem & {
  walkMinutes: number
  walkDistanceKm: number
  bikeMinutes: number
}

/** Mizzou Student Center — campus reference for commute estimates */
export const CAMPUS_CENTER = { lat: 38.94345, lng: -92.32845, label: 'Mizzou Student Center' }

/** Approximate center of Columbia, MO for city-wide map view */
export const COLUMBIA_CENTER = { lat: 38.9517, lng: -92.3341, label: 'Columbia, MO' }

/** Rough bounding box covering greater Columbia */
export const COLUMBIA_BOUNDS = {
  southWest: { lat: 38.905, lng: -92.355 },
  northEast: { lat: 38.975, lng: -92.285 },
}

const WALK_SPEED_KMH = 5
const BIKE_SPEED_KMH = 15

export function estimateWalkMinutes(from: { lat: number; lng: number }, to = CAMPUS_CENTER) {
  const km = distanceKm(from, to)
  return Math.max(1, Math.round((km / WALK_SPEED_KMH) * 60))
}

export function estimateBikeMinutes(from: { lat: number; lng: number }, to = CAMPUS_CENTER) {
  const km = distanceKm(from, to)
  return Math.max(1, Math.round((km / BIKE_SPEED_KMH) * 60))
}

export function formatWalkTime(minutes: number) {
  if (minutes <= 8) return `${minutes} min walk to campus`
  if (minutes <= 25) return `${minutes} min walk to campus`
  return `${minutes}+ min walk to campus`
}

export function formatBikeTime(minutes: number) {
  return `${minutes} min bike to campus`
}

export function enrichHousing(item: HousingItem): HousingWithCommute {
  const walkMinutes = estimateWalkMinutes(item)
  const walkDistanceKm = distanceKm(item, CAMPUS_CENTER)
  return {
    ...item,
    walkMinutes,
    walkDistanceKm,
    bikeMinutes: estimateBikeMinutes(item),
  }
}

export function getAllHousing(): HousingWithCommute[] {
  return (housingData as HousingItem[]).map(enrichHousing)
}

export function getHousingById(id: number) {
  const item = (housingData as HousingItem[]).find(h => h.id === id)
  return item ? enrichHousing(item) : null
}

export function getHousingNeighborhoods(items: HousingWithCommute[] = getAllHousing()) {
  return [...new Set(items.map(h => h.neighborhood))].sort()
}

export function filterHousingByNeighborhood(
  items: HousingWithCommute[],
  neighborhood: string
) {
  if (!neighborhood || neighborhood === 'All Columbia') return items
  return items.filter(h => h.neighborhood === neighborhood)
}

export function googleMapsWalkUrl(from: { lat: number; lng: number }, to = CAMPUS_CENTER) {
  const params = new URLSearchParams({
    api: '1',
    origin: `${from.lat},${from.lng}`,
    destination: `${to.lat},${to.lng}`,
    travelmode: 'walking',
  })
  return `https://www.google.com/maps/dir/?${params}`
}

export function sortByWalkTime(items: HousingWithCommute[]) {
  return [...items].sort((a, b) => a.walkMinutes - b.walkMinutes)
}

export function parseRentRange(rent: string): { min: number | null; max: number | null } {
  if (/ask/i.test(rent)) return { min: null, max: null }
  const nums = rent.match(/[\d,]+/g)?.map(s => parseInt(s.replace(/,/g, ''), 10)) ?? []
  if (!nums.length) return { min: null, max: null }
  if (nums.length === 1) return { min: nums[0], max: nums[0] }
  return { min: nums[0], max: nums[1] }
}

export function parseMinBeds(beds: string): number {
  if (/studio/i.test(beds)) return 0
  const m = beds.match(/(\d+)/)
  return m ? parseInt(m[1], 10) : 1
}

export type HousingFilterOptions = {
  neighborhood?: string
  maxRent?: number | null
  minBeds?: number | null
  maxWalk?: number | null
  favoritesOnly?: boolean
  favoriteIds?: Set<number>
}

export function filterHousingAdvanced(
  items: HousingWithCommute[],
  options: HousingFilterOptions = {}
) {
  const {
    neighborhood,
    maxRent,
    minBeds,
    maxWalk,
    favoritesOnly,
    favoriteIds,
  } = options

  return items.filter(h => {
    if (neighborhood && neighborhood !== 'All Columbia' && h.neighborhood !== neighborhood) {
      return false
    }
    if (maxWalk != null && maxWalk > 0 && h.walkMinutes > maxWalk) return false
    if (minBeds != null && minBeds > 0 && parseMinBeds(h.beds) < minBeds) return false
    if (maxRent != null && maxRent > 0) {
      const { min } = parseRentRange(h.rent)
      if (min != null && min > maxRent) return false
    }
    if (favoritesOnly && favoriteIds && !favoriteIds.has(h.id)) return false
    return true
  })
}

export type HousingMapParams = {
  maxRent?: number
  minBeds?: number
  maxWalk?: number
  neighborhood?: string
  favorites?: boolean
}

export function buildHousingMapUrl(params: HousingMapParams = {}) {
  const sp = new URLSearchParams()
  sp.set('housing', '1')
  sp.set('tab', 'housing')
  if (params.maxRent) sp.set('maxRent', String(params.maxRent))
  if (params.minBeds) sp.set('minBeds', String(params.minBeds))
  if (params.maxWalk) sp.set('maxWalk', String(params.maxWalk))
  if (params.neighborhood && params.neighborhood !== 'All Columbia') {
    sp.set('neighborhood', params.neighborhood)
  }
  if (params.favorites) sp.set('favorites', '1')
  return `/map?${sp.toString()}`
}

export function parseHousingMapSearch(search: string): HousingMapParams & { housing?: boolean; tab?: string } {
  const sp = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const num = (key: string) => {
    const v = sp.get(key)
    if (!v) return undefined
    const n = parseInt(v, 10)
    return Number.isFinite(n) ? n : undefined
  }
  return {
    housing: sp.get('housing') === '1',
    tab: sp.get('tab') ?? undefined,
    maxRent: num('maxRent'),
    minBeds: num('minBeds'),
    maxWalk: num('maxWalk'),
    neighborhood: sp.get('neighborhood') ?? undefined,
    favorites: sp.get('favorites') === '1',
  }
}
