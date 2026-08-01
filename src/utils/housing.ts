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
