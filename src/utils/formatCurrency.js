function formatCurrency (value, { currency, locale, round }) {
  return `${new Intl.NumberFormat(locale, {
    currency,
    currencyDisplay: 'narrowSymbol',
    roundingMode: round ? 'halfCeil' : undefined,
    maximumFractionDigits: round ? 0 : undefined,
    style: 'currency',
   }).format(value)}`
}

export default formatCurrency
