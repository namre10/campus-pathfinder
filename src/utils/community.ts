import type { Community, CommunityCategory, HobbyInterest } from '../types/Community'
import type { EventItem } from '../data/events'
import { isUpcoming } from './events'

export type CommunityFilterChip = 'all' | CommunityCategory | 'joined'

export type MeetingFormatFilter = 'all' | 'In person' | 'Online' | 'Hybrid'

export const CATEGORY_CHIPS: { id: CommunityFilterChip; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'Sports', label: 'Sports' },
  { id: 'Academic', label: 'Academic' },
  { id: 'Culture', label: 'Culture' },
  { id: 'Technology', label: 'Technology' },
  { id: 'Volunteering', label: 'Volunteering' },
  { id: 'Professional', label: 'Professional' },
  { id: 'Hobby', label: 'Hobby' },
  { id: 'joined', label: 'Joined' },
]

export const FORMAT_CHIPS: { id: MeetingFormatFilter; label: string }[] = [
  { id: 'all', label: 'Any format' },
  { id: 'In person', label: 'In person' },
  { id: 'Online', label: 'Online' },
  { id: 'Hybrid', label: 'Hybrid' },
]

export const INTEREST_OPTIONS: { id: HobbyInterest; label: string; icon: string }[] = [
  { id: 'soccer', label: 'Soccer', icon: '⚽' },
  { id: 'coding', label: 'Coding', icon: '💻' },
  { id: 'photography', label: 'Photography', icon: '📷' },
  { id: 'hiking', label: 'Hiking', icon: '🥾' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
  { id: 'culture', label: 'Culture', icon: '🌍' },
  { id: 'volunteering', label: 'Volunteering', icon: '🤝' },
]

export const CATEGORY_ICONS: Record<CommunityCategory, string> = {
  Sports: '⚽',
  Academic: '📚',
  Culture: '🌍',
  Technology: '💻',
  Volunteering: '🤝',
  Professional: '💼',
  Hobby: '🎨',
}

export function getCategoryIcon(category: CommunityCategory) {
  return CATEGORY_ICONS[category] || '👥'
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function scoreByInterests(community: Community, interests: HobbyInterest[]) {
  if (interests.length === 0) return 0
  return community.tags.filter(tag => interests.includes(tag as HobbyInterest)).length
}

export function filterCommunities(
  communities: Community[],
  opts: {
    search: string
    category: CommunityFilterChip
    format: MeetingFormatFilter
    interests: HobbyInterest[]
    joinedIds: number[]
  }
) {
  const term = opts.search.trim().toLowerCase()
  return communities.filter(c => {
    if (opts.category === 'joined' && !opts.joinedIds.includes(c.id)) return false
    if (opts.category !== 'all' && opts.category !== 'joined' && c.category !== opts.category) return false
    if (opts.format !== 'all' && c.meetingFormat !== opts.format) return false
    if (opts.interests.length > 0 && scoreByInterests(c, opts.interests) === 0) return false
    if (term === '') return true
    return (
      c.name.toLowerCase().includes(term) ||
      c.description.toLowerCase().includes(term) ||
      c.leader.toLowerCase().includes(term) ||
      c.tags.join(' ').toLowerCase().includes(term) ||
      c.category.toLowerCase().includes(term)
    )
  })
}

export function getRecommendedCommunities(
  communities: Community[],
  interests: HobbyInterest[],
  joinedIds: number[],
  limit = 6
) {
  if (interests.length === 0) {
    return communities
      .filter(c => !joinedIds.includes(c.id))
      .sort((a, b) => b.memberCount - a.memberCount)
      .slice(0, limit)
  }
  return [...communities]
    .map(c => ({ community: c, score: scoreByInterests(c, interests) }))
    .filter(item => item.score > 0 && !joinedIds.includes(item.community.id))
    .sort((a, b) => b.score - a.score || b.community.memberCount - a.community.memberCount)
    .map(item => item.community)
    .slice(0, limit)
}

export function getCommunityActivities(community: Community, allEvents: EventItem[]) {
  const byId = allEvents.filter(e => community.activities.includes(e.id))
  const byCommunity = allEvents.filter(e => e.communityId === community.id)
  const merged = [...byId]
  for (const ev of byCommunity) {
    if (!merged.some(e => e.id === ev.id)) merged.push(ev)
  }
  return merged.filter(isUpcoming).sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  )
}

export function getRelatedCommunities(
  all: Community[],
  current: Community,
  limit = 3
) {
  return all
    .filter(c => c.id !== current.id)
    .map(c => ({
      community: c,
      score:
        (c.category === current.category ? 2 : 0) +
        c.tags.filter(tag => current.tags.includes(tag)).length,
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || b.community.memberCount - a.community.memberCount)
    .map(item => item.community)
    .slice(0, limit)
}

export function countUpcomingCommunityActivities(communities: Community[], events: EventItem[]) {
  const ids = new Set<number>()
  for (const c of communities) {
    for (const ev of getCommunityActivities(c, events)) ids.add(ev.id)
  }
  return ids.size
}

export function loadJoinedCommunities(): number[] {
  try {
    const raw = JSON.parse(localStorage.getItem('campus_pathfinder_joined_communities') || '[]')
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}
