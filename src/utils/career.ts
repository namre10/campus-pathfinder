import advisors from '../data/advisors'
import type { Advisor, CareerMeeting, MeetingFormat } from '../types/CareerAdvising'

export const PROVIDER_LABELS: Record<string, string> = {
  professor: 'Professor',
  career_advisor: 'Career Advisor',
  academic_advisor: 'Academic Advisor',
  alumni: 'Alumni Mentor',
  industry_mentor: 'Industry Mentor',
  research_mentor: 'Research Mentor',
}

export function getAdvisor(id: number) {
  return advisors.find(a => a.id === id)
}

export function getAdvisorName(id: number) {
  return getAdvisor(id)?.name ?? `Advisor #${id}`
}

export function getAdvisorInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export function formatMeetingTime(start?: string, end?: string) {
  if (!start) return 'Time TBD'
  const s = new Date(start)
  const date = s.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
  const time = s.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  if (end) {
    const e = new Date(end).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
    return `${date} · ${time} – ${e}`
  }
  return `${date} · ${time}`
}

export function loadMeetings(): CareerMeeting[] {
  try {
    const stored = JSON.parse(localStorage.getItem('career_meetings') || '[]')
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

export function saveMeetings(meetings: CareerMeeting[]) {
  localStorage.setItem('career_meetings', JSON.stringify(meetings))
}

export function getBookedSlotIds(meetings = loadMeetings()) {
  return meetings.filter(m => m.status === 'confirmed').map(m => m.availabilitySlotId)
}

export function filterAdvisors(
  list: Advisor[],
  opts: { topic?: string; format?: MeetingFormat | 'all'; search?: string }
) {
  const term = opts.search?.trim().toLowerCase() ?? ''
  return list.filter(a => {
    if (opts.topic && opts.topic !== 'All') {
      const matchTopic = a.expertise.includes(opts.topic)
      const matchType = a.providerType === opts.topic
      if (!matchTopic && !matchType) return false
    }
    if (opts.format && opts.format !== 'all') {
      if (!a.meetingFormats.includes(opts.format)) return false
    }
    if (term) {
      const hay = [a.name, a.role, a.department, a.bio, ...a.expertise].join(' ').toLowerCase()
      if (!hay.includes(term)) return false
    }
    return true
  })
}

export function upcomingMeetings(meetings: CareerMeeting[]) {
  const now = new Date()
  return meetings
    .filter(m => m.status === 'confirmed' && m.startTime && new Date(m.startTime) >= now)
    .sort((a, b) => new Date(a.startTime!).getTime() - new Date(b.startTime!).getTime())
}

export function buildCalendarIcsForMeeting(meeting: CareerMeeting, advisorName: string, locationName?: string) {
  if (!meeting.startTime) return ''
  const start = new Date(meeting.startTime)
  const end = meeting.endTime ? new Date(meeting.endTime) : new Date(start.getTime() + 30 * 60 * 1000)
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Campus Pathfinder//EN',
    'BEGIN:VEVENT',
    `UID:meeting-${meeting.id}@campus-pathfinder`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:Career meeting with ${advisorName.replace(/,/g, '\\,')}`,
    `DESCRIPTION:${meeting.topic.replace(/,/g, '\\,')}`,
    locationName ? `LOCATION:${locationName.replace(/,/g, '\\,')}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`
}
