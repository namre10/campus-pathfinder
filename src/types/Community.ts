export type CommunityCategory =
  | 'Sports'
  | 'Academic'
  | 'Culture'
  | 'Technology'
  | 'Volunteering'
  | 'Professional'
  | 'Hobby'

export type Community = {
  id: number
  name: string
  category: CommunityCategory
  description: string
  memberCount: number
  leader: string
  tags: string[]
  meetingSchedule: string
  locationId: number
  activities: number[]
  meetingFormat: 'In person' | 'Online' | 'Hybrid'
  profileImage?: string
}

export type HobbyInterest =
  | 'soccer'
  | 'coding'
  | 'photography'
  | 'hiking'
  | 'music'
  | 'gaming'
  | 'culture'
  | 'volunteering'
