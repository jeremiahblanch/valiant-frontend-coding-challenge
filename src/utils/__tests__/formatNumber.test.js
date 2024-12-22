import { expect, test } from 'vitest'
import { formatNumber } from '@/utils/formatNumber.js'

describe('formatNumber', () => {
  // TODO - tests for other locales
  const cases = [
    { locale: 'AU-en', value: 0, round: false, expected: '0' },
    { locale: 'AU-en', value: 0, round: true, expected: '0' },
    { locale: 'AU-en', value: 123.45, round: false, expected: '123.45' },
    { locale: 'AU-en', value: 123.45, round: true, expected: '123' },
    { locale: 'AU-en', value: 12345.67, round: false, expected: '12,345.67' },
    { locale: 'AU-en', value: 12345.67, round: true, expected: '12,346' },
  ]

  test.each(cases)('%# given value: $value, locale: $locale, round: $round, return $expected', ({
    locale,
    value,
    round,
    expected,
  }) => expect(formatNumber(value, { locale, round })).toBe(expected))
})
