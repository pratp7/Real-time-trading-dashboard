import { describe, expect, it } from 'vitest'

import {
  DEFAULT_LIMIT,
  getAllowedIntervals,
  isAllowedInterval,
  MAX_LIMIT,
  toSafeLimit,
} from '../../services/marketValidation'

describe('marketValidation', () => {
  it('accepts expected intervals and rejects unknown values', () => {
    expect(isAllowedInterval('1m')).toBe(true)
    expect(isAllowedInterval('4h')).toBe(true)
    expect(isAllowedInterval('7m')).toBe(false)
    expect(getAllowedIntervals()).toContain('1d')
  })

  it('normalizes and validates limits', () => {
    expect(toSafeLimit(undefined)).toBe(DEFAULT_LIMIT)
    expect(toSafeLimit('50')).toBe(50)
    expect(toSafeLimit('0')).toBeNull()
    expect(toSafeLimit(String(MAX_LIMIT + 1))).toBeNull()
    expect(toSafeLimit('abc')).toBeNull()
  })
})
