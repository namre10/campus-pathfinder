import knowledge from '../data/tigerGuideKnowledge.json'
import {
  findGuideResponse,
  type GuideLink,
  type GuideResponse,
  type GuideTopic,
} from './tigerGuide'

const STORAGE_KEY = 'tiger_guide_gemini_key'
const DEFAULT_MODEL = 'gemini-2.0-flash'
const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models'

export function getGeminiApiKey() {
  return (
    localStorage.getItem(STORAGE_KEY)?.trim() ||
    import.meta.env.VITE_GEMINI_API_KEY?.trim() ||
    ''
  )
}

export function saveGeminiApiKey(key: string) {
  const trimmed = key.trim()
  if (trimmed) localStorage.setItem(STORAGE_KEY, trimmed)
  else localStorage.removeItem(STORAGE_KEY)
}

export function isLlmConfigured() {
  return Boolean(getGeminiApiKey())
}

export function getLlmModelLabel() {
  return `Google Gemini (${DEFAULT_MODEL})`
}

function getTopics() {
  return knowledge.topics as GuideTopic[]
}

function rankTopics(query: string, limit = 3) {
  const q = query.toLowerCase()
  return getTopics()
    .map(topic => {
      let score = 0
      for (const kw of topic.keywords) {
        if (q.includes(kw.toLowerCase())) score += kw.split(' ').length + 1
      }
      return { topic, score }
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.topic)
}

function buildKnowledgeContext(query: string) {
  const ranked = rankTopics(query, 3)
  const topics = ranked.length > 0 ? ranked : getTopics().slice(0, 5)
  return topics
    .map(t => JSON.stringify({
      id: t.id,
      title: t.title,
      answer: t.answer,
      steps: t.steps ?? [],
      links: t.links ?? [],
      tips: t.tips ?? [],
    }))
    .join('\n')
}

type LlmPayload = {
  title?: string
  answer?: string
  steps?: string[]
  tips?: string[]
  topicIds?: string[]
}

function linksFromTopicIds(ids: string[]): GuideLink[] {
  const topics = getTopics()
  const seen = new Set<string>()
  const links: GuideLink[] = []
  for (const id of ids) {
    const topic = topics.find(t => t.id === id)
    for (const link of topic?.links ?? []) {
      const key = `${link.url}|${link.label}`
      if (!seen.has(key)) {
        seen.add(key)
        links.push(link)
      }
    }
  }
  return links
}

function parseLlmResponse(raw: string, query: string): GuideResponse {
  const fallback = findGuideResponse(query)
  try {
    const parsed = JSON.parse(raw) as LlmPayload
    const title = parsed.title?.trim() || fallback.title
    const answer = parsed.answer?.trim() || fallback.answer
    const steps = Array.isArray(parsed.steps) ? parsed.steps.filter(Boolean) : fallback.steps
    const tips = Array.isArray(parsed.tips) ? parsed.tips.filter(Boolean) : fallback.tips
    const topicIds = Array.isArray(parsed.topicIds) ? parsed.topicIds.filter(Boolean) : []
    const links = topicIds.length > 0 ? linksFromTopicIds(topicIds) : fallback.links

    return {
      topicId: topicIds[0] ?? fallback.topicId,
      title,
      answer,
      steps,
      links: links.length > 0 ? links : fallback.links,
      tips,
      matched: topicIds.length > 0 || fallback.matched,
    }
  } catch {
    return {
      ...fallback,
      answer: raw.trim() || fallback.answer,
    }
  }
}

export type ChatTurn = { role: 'user' | 'assistant'; content: string }

function buildSystemPrompt(context: string) {
  return `You are Tiger Guide, a helpful copilot for University of Missouri (Mizzou) students.
Use ONLY the knowledge topics below. Do not invent Mizzou policies, deadlines, phone numbers, or URLs.
If the question is outside the knowledge base, say you are not sure and recommend contacting an advisor or the relevant Mizzou office.
Always be concise, friendly, and practical.

Respond with valid JSON only (no markdown fences), in this shape:
{
  "title": "short heading",
  "answer": "2-4 sentences in plain English",
  "steps": ["optional action steps"],
  "tips": ["optional tips, e.g. questions to ask a mentor"],
  "topicIds": ["id-from-knowledge", "..."]
}

Pick topicIds from the knowledge topics you used so the app can show official links. Use 1-3 topic ids.

KNOWLEDGE TOPICS:
${context}`
}

export async function askTigerGuideLlm(
  query: string,
  history: ChatTurn[] = []
): Promise<{ response: GuideResponse; source: 'llm' | 'mock'; error?: string }> {
  const apiKey = getGeminiApiKey()
  if (!apiKey) {
    return { response: findGuideResponse(query), source: 'mock' }
  }

  const context = buildKnowledgeContext(query)
  const systemPrompt = buildSystemPrompt(context)

  const contents = [
    ...history.slice(-6).map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }],
    })),
    { role: 'user', parts: [{ text: query }] },
  ]

  const url = `${GEMINI_API}/${DEFAULT_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          temperature: 0.35,
          responseMimeType: 'application/json',
        },
      }),
    })

    if (!resp.ok) {
      const text = await resp.text()
      let msg = `Gemini error (${resp.status})`
      if (resp.status === 400 || resp.status === 403) {
        msg = 'Invalid Gemini API key — get a free key at Google AI Studio.'
      } else if (resp.status === 429) {
        msg = 'Gemini rate limit reached — wait a minute and try again.'
      }
      return {
        response: findGuideResponse(query),
        source: 'mock',
        error: msg + (text ? ` ${text.slice(0, 100)}` : ''),
      }
    }

    const data = await resp.json()
    const content =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join('')

    if (!content) {
      const blockReason = data?.candidates?.[0]?.finishReason
      return {
        response: findGuideResponse(query),
        source: 'mock',
        error: blockReason ? `Gemini blocked response: ${blockReason}` : 'Empty response from Gemini',
      }
    }

    return {
      response: parseLlmResponse(content, query),
      source: 'llm',
    }
  } catch (err) {
    return {
      response: findGuideResponse(query),
      source: 'mock',
      error: err instanceof Error ? err.message : 'Network error',
    }
  }
}
