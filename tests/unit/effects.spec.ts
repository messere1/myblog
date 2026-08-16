import { describe, expect, it } from 'vitest'
import { effectBudgets, resolveEffectQuality, seededValue } from '@/utils/effects'

describe('ambient effect quality', () => {
  it('disables motion when the visitor requests reduced motion', () => {
    expect(resolveEffectQuality({ reducedMotion: true, compactViewport: false, hardwareConcurrency: 16 })).toBe('static')
  })

  it('uses a lighter budget on compact and lower-powered devices', () => {
    expect(resolveEffectQuality({ reducedMotion: false, compactViewport: true, hardwareConcurrency: 16 })).toBe('low')
    expect(resolveEffectQuality({ reducedMotion: false, compactViewport: false, hardwareConcurrency: 4 })).toBe('low')
  })

  it('keeps the full effect on capable desktop devices', () => {
    expect(resolveEffectQuality({ reducedMotion: false, compactViewport: false, hardwareConcurrency: 8 })).toBe('high')
    expect(effectBudgets.high.motes).toBeGreaterThan(effectBudgets.low.motes)
  })

  it('generates stable values inside the unit interval', () => {
    expect(seededValue(42)).toBe(seededValue(42))
    expect(seededValue(42)).toBeGreaterThanOrEqual(0)
    expect(seededValue(42)).toBeLessThan(1)
  })
})
