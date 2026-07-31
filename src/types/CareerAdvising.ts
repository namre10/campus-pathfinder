export type ProviderType =
  | 'professor'
  | 'career_advisor'
  | 'academic_advisor'
  | 'alumni'
  | 'industry_mentor'
  | 'research_mentor'

export type MeetingFormat = 'in_person' | 'online'

export type Advisor = {
  id: number
  name: string
  role: string
  providerType: ProviderType
  department: string
  bio: string
  expertise: string[]
  meetingFormats: MeetingFormat[]
  locationId?: number
  profileImage?: string
}

export type AvailabilitySlot = {
  id: number
  advisorId: number
  startTime: string
  endTime: string
  isAvailable: boolean
}

export type CareerMeeting = {
  id: string
  studentId?: number | null
  advisorId: number
  availabilitySlotId: number
  topic: string
  studentMessage: string
  meetingFormat: MeetingFormat
  locationId?: number
  meetingLink?: string
  status: 'confirmed' | 'cancelled' | 'completed'
  startTime?: string
  endTime?: string
}
