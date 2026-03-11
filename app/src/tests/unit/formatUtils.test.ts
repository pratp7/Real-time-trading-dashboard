import { describe, expect, it } from 'vitest'

import { classNames } from '../../utils/classNames'
import { formatPercent } from '../../utils/formatPercent'
import { formatPrice } from '../../utils/formatPrice'

describe('format utilities', () => {
  it('formats price in USD with default precision', () => {
    expect(formatPrice(1234.5)).toBe('$1,234.50')
  })

  it('formats percent with explicit plus sign for positive values', () => {
    expect(formatPercent(2.345)).toBe('+2.35%')
    expect(formatPercent(-1.234)).toBe('-1.23%')
  })

  it('joins only truthy class tokens', () => {
    expect(classNames('row', false, undefined, 'active', null)).toBe('row active')
  })
})
