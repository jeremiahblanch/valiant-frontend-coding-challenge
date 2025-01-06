import useCurrency from './useCurrency'
import useLocale from './useLocale'
import formatCurrency from '@/utils/formatCurrency'
import formatNumber from '@/utils/formatNumber'

function useFormat () {
  const { currency } = useCurrency()
  const { locale } = useLocale()

  return {
    formatCurrency: (value) => formatCurrency(value, { locale, currency, round: true }),
    formatNumber: (value) => formatNumber(value, { locale, currency, round: true }),
  }
}

export default useFormat
