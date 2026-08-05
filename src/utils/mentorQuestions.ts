import type { CareerGoal, CareerYear } from './careerProfile'
import { getCareerGoalLabel, getCareerYearLabel } from './careerProfile'

const BASE_BY_GOAL: Record<CareerGoal, string[]> = {
  internship: [
    'What skills mattered most in your first internship after Mizzou?',
    'How did you find and apply to your first internship?',
    'What would you do differently in your junior year to prepare for internships?',
    'What does a typical week look like in your current role?',
    'How can I stand out as an intern candidate from Mizzou?',
  ],
  fulltime: [
    'What drew you to your current role after graduating from Mizzou?',
    'When should I start applying for full-time roles in my field?',
    'What do hiring managers wish candidates knew before interviewing?',
    'How did you use Handshake or campus recruiting in your job search?',
    'What clubs or projects helped you most on your resume?',
  ],
  gradschool: [
    'How did you decide grad school was the right path for you?',
    'What should I prioritize sophomore/junior year for grad school applications?',
    'Who did you ask for recommendation letters, and when?',
    'What surprised you most about the application process?',
    'Are there Mizzou resources you wish you had used earlier?',
  ],
  explore: [
    'How did you explore careers before committing to your current path?',
    'What questions should I ask in informational interviews?',
    'What Mizzou resources helped you figure out your direction?',
    'If you were my age again, what would you try first?',
    'What industries do you see hiring Mizzou grads from my major?',
  ],
}

const MAJOR_TWEAKS: Record<string, string> = {
  'Computer Science': 'For software roles, ask about portfolios, GitHub, and technical interviews.',
  Business: 'For business roles, ask about internships in consulting, finance, or marketing paths.',
  Engineering: 'For engineering roles, ask about co-ops, labs, and PE/licensing if relevant.',
  Journalism: 'For media roles, ask about clips, internships, and building a portfolio early.',
}

export function buildMentorQuestions(
  major: string,
  goal: CareerGoal,
  year?: CareerYear
): { questions: string[]; intro: string; tip: string } {
  const questions = [...(BASE_BY_GOAL[goal] ?? BASE_BY_GOAL.explore)]
  const yearLabel = year ? getCareerYearLabel(year) : 'Mizzou'
  const goalLabel = getCareerGoalLabel(goal).toLowerCase()
  const majorNote = MAJOR_TWEAKS[major]

  if (major.toLowerCase().includes('computer') || major === 'Computer Science') {
    questions[0] = 'What technical skills do Mizzou CS students undervalue before internship season?'
  }

  return {
    intro: `As a ${yearLabel} ${major} student focused on ${goalLabel}, here are questions to ask on Mizzou Mentoring:`,
    questions: questions.slice(0, 5),
    tip: majorNote ?? 'Keep chats to 20–30 minutes and send a thank-you note afterward.',
  }
}
