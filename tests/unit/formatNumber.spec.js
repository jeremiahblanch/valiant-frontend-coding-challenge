import formatNumber from '@/utils/formatNumber'

describe('formatNumber', () => {
  const cases = [
    { locale: 'en-AU', value: 0, round: false, expected: '0' },
    { locale: 'en-AU', value: 0, round: true, expected: '0' },
    { locale: 'en-AU', value: 123.45, round: false, expected: '123.45' },
    { locale: 'en-AU', value: 123.45, round: true, expected: '123' },
    { locale: 'en-AU', value: 12345.67, round: false, expected: '12,345.67' },
    { locale: 'en-AU', value: 12345.67, round: true, expected: '12,346' },

    // TODO - other locales
  ]

  it.each(cases)('%# given value: $value, locale: $locale, round: $round, return $expected', ({
    locale,
    value,
    round,
    expected,
  }) => expect(formatNumber(value, { locale, round })).toBe(expected))
})
