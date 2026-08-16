export type EffectQuality = 'high' | 'low' | 'static'

export interface EffectEnvironment {
  reducedMotion: boolean
  compactViewport: boolean
  hardwareConcurrency?: number
}

export const effectBudgets: Record<EffectQuality, { motes: number; petals: number }> = {
  high: { motes: 18, petals: 12 },
  low: { motes: 8, petals: 5 },
  static: { motes: 4, petals: 2 },
}

export function resolveEffectQuality(environment: EffectEnvironment): EffectQuality {
  if (environment.reducedMotion) return 'static'
  if (environment.compactViewport) return 'low'
  if (environment.hardwareConcurrency && environment.hardwareConcurrency <= 4) return 'low'
  return 'high'
}

export function seededValue(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453
  return value - Math.floor(value)
}
