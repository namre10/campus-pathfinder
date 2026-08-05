export type CareerYear = 'freshman' | 'sophomore' | 'junior' | 'senior'
export type CareerGoal = 'internship' | 'fulltime' | 'gradschool' | 'explore'

export type CareerProfile = {
  major: string
  year: CareerYear
  goal: CareerGoal
}

const STORAGE_KEY = 'campus_pathfinder_career_profile'

export const CAREER_MAJORS = [
  'Computer Science',
  'Business',
  'Engineering',
  'Journalism',
  'Health Sciences',
  'Education',
  'Arts & Sciences',
  'Other',
]

export const CAREER_YEARS: { id: CareerYear; label: string }[] = [
  { id: 'freshman', label: 'Freshman' },
  { id: 'sophomore', label: 'Sophomore' },
  { id: 'junior', label: 'Junior' },
  { id: 'senior', label: 'Senior' },
]

export const CAREER_GOALS: { id: CareerGoal; label: string }[] = [
  { id: 'internship', label: 'Internship' },
  { id: 'fulltime', label: 'Full-time job' },
  { id: 'gradschool', label: 'Grad school' },
  { id: 'explore', label: 'Still exploring' },
]

export function getCareerProfile(): CareerProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CareerProfile
    if (!parsed.major || !parsed.year || !parsed.goal) return null
    return parsed
  } catch {
    return null
  }
}

export function saveCareerProfile(profile: CareerProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  window.dispatchEvent(new CustomEvent('career-profile-changed'))
}

export function clearCareerProfile() {
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new CustomEvent('career-profile-changed'))
}

export function getCareerYearLabel(year: CareerYear) {
  return CAREER_YEARS.find(y => y.id === year)?.label ?? year
}

export function getCareerGoalLabel(goal: CareerGoal) {
  return CAREER_GOALS.find(g => g.id === goal)?.label ?? goal
}

export function getCareerProfileSummary() {
  const p = getCareerProfile()
  if (!p) return ''
  return `Student context: ${getCareerYearLabel(p.year)} studying ${p.major}, primary career goal: ${getCareerGoalLabel(p.goal)}. Personalize answers to this context when relevant.`
}

export function isCareerProfileComplete() {
  return Boolean(getCareerProfile())
}
