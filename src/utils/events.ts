import type { EventItem } from '../data/events'

export type EventFilterChip = 'all' | 'this-week' | 'events' | 'opportunities' | 'saved'

export function isUpcoming(ev: EventItem) {
  return new Date(ev.startTime) >= new Date()
}

export function isThisWeek(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 7)
  return d >= start && d < end
}

export function applyEventChip(events: EventItem[], chip: EventFilterChip, savedIds: number[]) {
  switch (chip) {
    case 'this-week':
      return events.filter(e => isThisWeek(e.startTime))
    case 'events':
      return events.filter(e => e.type === 'event')
    case 'opportunities':
      return events.filter(e => e.type === 'opportunity')
    case 'saved':
      return events.filter(e => savedIds.includes(e.id))
    default:
      return events
  }
}

export function groupEventsByDate(events: EventItem[]) {
  const groups: Record<string, EventItem[]> = {}
  for (const ev of events) {
    const key = new Date(ev.startTime).toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    if (!groups[key]) groups[key] = []
    groups[key].push(ev)
  }
  return Object.entries(groups).sort(
    (a, b) => new Date(a[1][0].startTime).getTime() - new Date(b[1][0].startTime).getTime()
  )
}

export function formatEventTime(ev: EventItem) {
  const start = new Date(ev.startTime)
  if (ev.type === 'opportunity' && !ev.endTime) {
    return start.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  }
  const date = start.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
  const time = start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  if (ev.endTime) {
    const end = new Date(ev.endTime).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
    return `${date} · ${time} – ${end}`
  }
  return `${date} · ${time}`
}

export function getRelatedEvents(all: EventItem[], current: EventItem, limit = 3) {
  return all
    .filter(e => e.id !== current.id && isUpcoming(e))
    .filter(e => e.communityId === current.communityId || e.type === current.type)
    .slice(0, limit)
}

export function buildCalendarIcs(ev: EventItem, locationName?: string) {
  const start = new Date(ev.startTime)
  const end = ev.endTime ? new Date(ev.endTime) : new Date(start.getTime() + 60 * 60 * 1000)
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Campus Pathfinder//EN',
    'BEGIN:VEVENT',
    `UID:event-${ev.id}@campus-pathfinder`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${ev.title.replace(/,/g, '\\,')}`,
    `DESCRIPTION:${ev.description.replace(/\n/g, '\\n').replace(/,/g, '\\,')}`,
    locationName ? `LOCATION:${locationName.replace(/,/g, '\\,')}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`
}
