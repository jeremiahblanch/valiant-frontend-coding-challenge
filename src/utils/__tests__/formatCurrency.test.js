import { expect, test } from 'vitest'
import { formatCurrency } from '@/utils/formatCurrency.js'

describe('formatCurrency', () => {
  // TODO - tests for other locales
  const cases = [
    { currency: 'AUD', locale: 'AU-en', value: 0, round: false, expected: '$0.00' },
    { currency: 'AUD', locale: 'AU-en', value: 0, round: true, expected: '$0' },
    { currency: 'AUD', locale: 'AU-en', value: 123.45, round: false, expected: '$123.45' },
    { currency: 'AUD', locale: 'AU-en', value: 123.45, round: true, expected: '$123' },
    { currency: 'AUD', locale: 'AU-en', value: 12345.67, round: false, expected: '$12,345.67' },
    { currency: 'AUD', locale: 'AU-en', value: 12345.67, round: true, expected: '$12,346' },
  ]

  test.each(cases)('%# given value: $value, currency: $currency, locale: $locale, round: $round, returns $expected', ({
    currency,
    locale,
    value,
    round,
    expected,
  }) => expect(formatCurrency(value, { currency, locale, round })).toBe(expected))
})
