/** Base URL for static JSON served from public/data (local dev + GitHub Pages). */
export function staticDataUrl(file: string) {
  const base = import.meta.env.BASE_URL || '/'
  return `${base}data/${file}`
}

export const STATIC_DATA_FILES = {
  locations: 'locations.json',
  events: 'events.json',
  communities: 'communities.json',
  advisors: 'advisors.json',
  availabilitySlots: 'availability-slots.json',
  housing: 'housing.json',
} as const

export async function fetchStaticJson<T>(file: string): Promise<T> {
  const res = await fetch(staticDataUrl(file))
  if (!res.ok) throw new Error(`Failed to load ${file} (${res.status})`)
  return res.json()
}
