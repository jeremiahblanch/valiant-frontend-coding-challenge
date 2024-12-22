import { expect, test } from 'vitest'
import { formatCurrency } from '@/utils/formatCurrency.js'

describe('formatCurrency', () => {
  const cases = [
    { currency: 'AUD', locale: 'en-AU', value: 0, round: false, expected: '$0.00' },
    { currency: 'AUD', locale: 'en-AU', value: 0, round: true, expected: '$0' },
    { currency: 'AUD', locale: 'en-AU', value: 123.45, round: false, expected: '$123.45' },
    { currency: 'AUD', locale: 'en-AU', value: 123.45, round: true, expected: '$123' },
    { currency: 'AUD', locale: 'en-AU', value: 12345.67, round: false, expected: '$12,345.67' },
    { currency: 'AUD', locale: 'en-AU', value: 12345.67, round: true, expected: '$12,346' },

    // other locales
    { currency: 'AUD', locale: 'en-GB', value: 0, round: false, expected: '$0.00' }, // ensure we don't see $A
    { currency: 'AUD', locale: 'en-US', value: 0, round: false, expected: '$0.00' }, // ensure we don't see $A
    // TODO - more complete other locales tests
  ]

  test.each(cases)('%# given value: $value, currency: $currency, locale: $locale, round: $round, returns $expected', ({
    currency,
    locale,
    value,
    round,
    expected,
  }) => expect(formatCurrency(value, { currency, locale, round })).toBe(expected))
})
