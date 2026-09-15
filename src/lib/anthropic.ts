import Anthropic from '@anthropic-ai/sdk'

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY manquante dans .env.local')
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const MODELS = {
  sonnet: 'claude-sonnet-5-20251101',
  opus: 'claude-opus-5-20251101',
  haiku: 'claude-haiku-4-5-20251001',
} as const

// Agents utilisant Opus (complexité maximale)
export const OPUS_AGENTS = ['tariq', 'imane'] as const

export function getModelForAgent(slug: string): string {
  return OPUS_AGENTS.includes(slug as typeof OPUS_AGENTS[number])
    ? MODELS.opus
    : MODELS.sonnet
}
