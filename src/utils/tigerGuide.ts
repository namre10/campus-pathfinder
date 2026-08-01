import knowledge from '../data/tigerGuideKnowledge.json'

export type GuideLink = {
  label: string
  url: string
  external?: boolean
}

export type GuideTopic = {
  id: string
  keywords: string[]
  title: string
  answer: string
  steps?: string[]
  links?: GuideLink[]
  tips?: string[]
}

export type GuideResponse = {
  topicId: string
  title: string
  answer: string
  steps: string[]
  links: GuideLink[]
  tips: string[]
  matched: boolean
}

function scoreTopic(topic: GuideTopic, query: string) {
  const q = query.toLowerCase()
  let score = 0
  for (const kw of topic.keywords) {
    if (q.includes(kw.toLowerCase())) score += kw.split(' ').length + 1
  }
  return score
}

export function getSuggestedPrompts() {
  return knowledge.suggestedPrompts as string[]
}

export function findGuideResponse(query: string): GuideResponse {
  const topics = knowledge.topics as GuideTopic[]
  const ranked = topics
    .map(topic => ({ topic, score: scoreTopic(topic, query) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)

  const best = ranked[0]?.topic
  if (best) {
    return {
      topicId: best.id,
      title: best.title,
      answer: best.answer,
      steps: best.steps ?? [],
      links: best.links ?? [],
      tips: best.tips ?? [],
      matched: true,
    }
  }

  const fallback = knowledge.fallback
  return {
    topicId: 'fallback',
    title: 'General help',
    answer: fallback.answer,
    steps: [],
    links: fallback.links ?? [],
    tips: [],
    matched: false,
  }
}

/** Simulated typing delay for a more natural chat feel */
export function guideReplyDelay(query: string) {
  return Math.min(900, 350 + query.length * 8)
}
