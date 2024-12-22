export function formatNumber (value, { locale, round }) {
  return `${new Intl.NumberFormat(locale, {
    roundingMode: round ? 'halfCeil' : undefined,
    maximumFractionDigits: round ? 0 : undefined,
   }).format(value)}`
}
