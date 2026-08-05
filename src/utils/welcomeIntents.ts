export type WelcomeIntent = {
  id: string
  label: string
  icon: string
  prompt: string
  mapUrl?: string
}

export const WELCOME_INTENTS: WelcomeIntent[] = [
  {
    id: 'holds',
    label: 'Clear a hold',
    icon: '🔒',
    prompt: 'I have a hold on my account — what should I do before registration?',
  },
  {
    id: 'classes',
    label: 'Plan classes',
    icon: '📚',
    prompt: 'Help me prepare for registration in Stellic',
  },
  {
    id: 'housing',
    label: 'Find housing',
    icon: '🏠',
    prompt: 'Show me off-campus housing within a 15-minute walk of campus',
    mapUrl: '/map?housing=1&tab=housing&maxWalk=15',
  },
  {
    id: 'jobs',
    label: 'Jobs & mentors',
    icon: '💼',
    prompt: 'Where do I find internships and talk to alumni mentors?',
  },
]

export function getWelcomeIntent(id: string) {
  return WELCOME_INTENTS.find(i => i.id === id)
}
