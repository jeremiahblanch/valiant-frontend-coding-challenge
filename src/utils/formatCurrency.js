export function formatCurrency (value, { currency, locale, round }) {
  return `${new Intl.NumberFormat(locale, {
    currency,
    roundingMode: round ? 'halfCeil' : undefined,
    maximumFractionDigits: round ? 0 : undefined,
    style: 'currency',
   }).format(value)}`
}
