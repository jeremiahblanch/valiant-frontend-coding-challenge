import useCurrency from './useCurrency'
import useLocale from './useLocale'
import formatValueAsLocaleCurrency from '@/utils/formatValueAsLocaleCurrency'
import formatValueAsLocaleNumber from '@/utils/formatValueAsLocaleNumber'

function useFormat () {
  const { currency } = useCurrency()
  const { locale } = useLocale()

  return {
    formatCurrency: (value) => formatValueAsLocaleCurrency(value, { locale, currency, round: true }),
    formatNumber: (value) => formatValueAsLocaleNumber(value, { locale, currency, round: true }),
  }
}

export default useFormat
