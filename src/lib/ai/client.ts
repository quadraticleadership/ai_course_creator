import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// Default models per use case — matches decisions.md R14
export const AI_MODELS = {
  // Fast, high quality — interviews, assessments, roleplay, clear story selection
  default: 'claude-sonnet-4-6',
  // Full power — curriculum generation, material finalization, CI engine
  generation: 'claude-opus-4-6',
} as const

export type AIModel = (typeof AI_MODELS)[keyof typeof AI_MODELS]
