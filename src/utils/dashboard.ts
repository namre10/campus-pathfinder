import events from '../data/events'
import communities from '../data/communities'
import type { EventItem } from '../data/events'
import type { Community } from '../types/Community'
import type { CareerMeeting } from '../types/CareerAdvising'
import { isUpcoming, formatEventTime } from './events'
import { formatMeetingTime, getAdvisorName, loadMeetings, upcomingMeetings } from './career'
import { getCommunityActivities } from './community'

export type DashboardItemType = 'event' | 'meeting' | 'activity'

export type DashboardAgendaItem = {
  id: string
  type: DashboardItemType
  title: string
  subtitle: string
  time: string
  sortTime: number
  link: string
  locationId?: number
  badge: string
}

export type DashboardSnapshot = {
  savedEventCount: number
  upcomingSavedEvents: EventItem[]
  careerMeetingCount: number
  upcomingMeetings: CareerMeeting[]
  favoriteCount: number
  favoriteIds: number[]
  joinedCount: number
  joinedCommunities: Community[]
  upcomingActivityCount: number
  nextUp: DashboardAgendaItem[]
}

export function buildDashboardSnapshot(opts: {
  savedEventIds: number[]
  joinedCommunityIds: number[]
  favoriteIds: number[]
  nextUpLimit?: number
}): DashboardSnapshot {
  const upcomingSavedEvents = events
    .filter(e => opts.savedEventIds.includes(e.id) && isUpcoming(e))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  const meetings = upcomingMeetings(loadMeetings())
  const joinedCommunities = communities.filter(c => opts.joinedCommunityIds.includes(c.id))

  const activityMap = new Map<number, EventItem>()
  for (const comm of joinedCommunities) {
    for (const ev of getCommunityActivities(comm, events)) {
      activityMap.set(ev.id, ev)
    }
  }
  const communityActivities = [...activityMap.values()].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  )

  const agenda: DashboardAgendaItem[] = []

  for (const ev of upcomingSavedEvents) {
    agenda.push({
      id: `event-${ev.id}`,
      type: 'event',
      title: ev.title,
      subtitle: ev.type === 'opportunity' ? 'Saved opportunity' : 'Saved event',
      time: formatEventTime(ev),
      sortTime: new Date(ev.startTime).getTime(),
      link: `/events/${ev.id}`,
      locationId: ev.locationId,
      badge: ev.type === 'opportunity' ? 'Opportunity' : 'Event',
    })
  }

  for (const m of meetings) {
    agenda.push({
      id: `meeting-${m.id}`,
      type: 'meeting',
      title: getAdvisorName(m.advisorId),
      subtitle: m.topic,
      time: formatMeetingTime(m.startTime, m.endTime),
      sortTime: m.startTime ? new Date(m.startTime).getTime() : Number.MAX_SAFE_INTEGER,
      link: '/career/my-meetings',
      locationId: m.locationId,
      badge: 'Career',
    })
  }

  for (const ev of communityActivities) {
    if (opts.savedEventIds.includes(ev.id)) continue
    const comm = communities.find(c => c.id === ev.communityId)
    agenda.push({
      id: `activity-${ev.id}`,
      type: 'activity',
      title: ev.title,
      subtitle: comm ? `${comm.name} activity` : 'Community activity',
      time: formatEventTime(ev),
      sortTime: new Date(ev.startTime).getTime(),
      link: `/events/${ev.id}`,
      locationId: ev.locationId,
      badge: 'Activity',
    })
  }

  const limit = opts.nextUpLimit ?? 6
  const nextUp = agenda
    .sort((a, b) => a.sortTime - b.sortTime)
    .slice(0, limit)

  return {
    savedEventCount: upcomingSavedEvents.length,
    upcomingSavedEvents: upcomingSavedEvents.slice(0, 5),
    careerMeetingCount: meetings.length,
    upcomingMeetings: meetings.slice(0, 5),
    favoriteCount: opts.favoriteIds.length,
    favoriteIds: opts.favoriteIds,
    joinedCount: joinedCommunities.length,
    joinedCommunities: joinedCommunities.slice(0, 5),
    upcomingActivityCount: communityActivities.length,
    nextUp,
  }
}

export function isDashboardEmpty(snapshot: DashboardSnapshot) {
  return (
    snapshot.savedEventCount === 0 &&
    snapshot.careerMeetingCount === 0 &&
    snapshot.favoriteCount === 0 &&
    snapshot.joinedCount === 0
  )
}
