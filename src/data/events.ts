export type EventItem = {
  id: number
  title: string
  description: string
  type: 'event' | 'opportunity'
  startTime: string
  endTime?: string
  deadline?: string
  eligibility?: string
  locationId?: number
  onlineLink?: string
  registrationLink?: string
  communityId?: number
}

export const events: EventItem[] = [
  {
    id: 1,
    title: 'Tech Career Fair',
    description: 'Meet recruiters from local tech companies and explore internship and job opportunities.',
    type: 'event',
    startTime: '2026-09-15T10:00:00',
    endTime: '2026-09-15T15:00:00',
    deadline: '2026-09-10',
    eligibility: 'All majors welcome',
    locationId: 3,
    registrationLink: 'https://campus.edu/career-fair/register'
  },
  {
    id: 2,
    title: 'Resume Workshop',
    description: 'Drop-in resume review hosted by the Career Center for students seeking internship and full-time roles.',
    type: 'event',
    startTime: '2026-08-10T13:00:00',
    endTime: '2026-08-10T14:30:00',
    deadline: '2026-08-09',
    eligibility: 'Undergraduate and graduate students',
    locationId: 2,
    registrationLink: 'https://campus.edu/resume-workshop/register'
  },
  {
    id: 3,
    title: 'Research Internship Opportunities',
    description: 'Apply for undergraduate research internships across campus labs and departments.',
    type: 'opportunity',
    startTime: '2026-08-01T00:00:00',
    deadline: '2026-08-15',
    eligibility: 'Students with a 3.0 GPA or higher',
    onlineLink: 'https://campus.edu/research-opps',
    registrationLink: 'https://campus.edu/research-opps/apply'
  },
  {
    id: 4,
    title: 'Interview Practice Night',
    description: 'Mock interviews with alumni mentors and career advisors to help you prepare for employer interviews.',
    type: 'event',
    startTime: '2026-08-20T17:00:00',
    endTime: '2026-08-20T20:00:00',
    deadline: '2026-08-19',
    eligibility: 'Students in any discipline',
    locationId: 5,
    registrationLink: 'https://campus.edu/interview-night/register'
  },
  {
    id: 5,
    title: 'Photography Club Campus Walk',
    description: 'Capture campus life with the Photography Club during a guided photo walk and critique session.',
    type: 'event',
    startTime: '2026-09-02T16:00:00',
    endTime: '2026-09-02T18:00:00',
    locationId: 1,
    registrationLink: 'https://campus.edu/photography-club/join',
    communityId: 4,
  },
  {
    id: 6,
    title: 'Hiking Club Trail Day',
    description: 'Meet the Hiking Club for a campus trail exploration and outdoor community meetup.',
    type: 'event',
    startTime: '2026-09-08T09:00:00',
    endTime: '2026-09-08T12:00:00',
    locationId: 5,
    registrationLink: 'https://campus.edu/hiking-club/events',
    communityId: 5,
  },
  {
    id: 7,
    title: 'Chess Club Tournament Night',
    description: 'Join the Chess Club for an evening of friendly matches, coaching, and tournament play.',
    type: 'event',
    startTime: '2026-09-10T18:00:00',
    endTime: '2026-09-10T21:00:00',
    locationId: 2,
    registrationLink: 'https://campus.edu/chess-club/register',
    communityId: 7,
  },
  {
    id: 8,
    title: 'Volunteer Network Service Project',
    description: 'Participate in a service day with the Volunteer Network to support a local community partner.',
    type: 'event',
    startTime: '2026-09-12T10:00:00',
    endTime: '2026-09-12T14:00:00',
    locationId: 7,
    registrationLink: 'https://campus.edu/volunteer-network/signup',
    communityId: 8,
  },
  {
    id: 9,
    title: 'Recreational Soccer Scrimmage',
    description: 'Open scrimmage for all skill levels — meet teammates and play friendly matches on the rec fields.',
    type: 'event',
    startTime: '2026-09-06T18:00:00',
    endTime: '2026-09-06T20:00:00',
    locationId: 8,
    registrationLink: 'https://campus.edu/soccer-club/join',
    communityId: 1,
  },
  {
    id: 10,
    title: 'Flag Football Pickup Game',
    description: 'Weekly pickup games and drills for the Flag Football community — newcomers welcome.',
    type: 'event',
    startTime: '2026-09-07T17:30:00',
    endTime: '2026-09-07T19:30:00',
    locationId: 8,
    registrationLink: 'https://campus.edu/flag-football/signup',
    communityId: 2,
  },
  {
    id: 11,
    title: 'AI Student Community Hack Night',
    description: 'Collaborate on AI projects, share research papers, and prepare for upcoming hackathons.',
    type: 'event',
    startTime: '2026-09-05T19:00:00',
    endTime: '2026-09-05T22:00:00',
    locationId: 4,
    onlineLink: 'https://campus.edu/ai-community/meet',
    registrationLink: 'https://campus.edu/ai-community/register',
    communityId: 3,
  },
  {
    id: 12,
    title: 'International Student Welcome Mixer',
    description: 'Celebrate cultures from around the world with food, music, and conversation at the student center.',
    type: 'event',
    startTime: '2026-09-04T18:00:00',
    endTime: '2026-09-04T21:00:00',
    locationId: 3,
    registrationLink: 'https://campus.edu/international-students/mixer',
    communityId: 6,
  },
]

export default events
