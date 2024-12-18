export function formatCurrency (value, prefix = '$') {
  return `${prefix}${new Intl.NumberFormat().format(value)}`
}
