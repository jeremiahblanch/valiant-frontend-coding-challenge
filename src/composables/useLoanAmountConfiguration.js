import { onMounted, ref } from 'vue'
import { fetchLoanPurposes, fetchRequestedPaymentPeriods, fetchRequestedTermMonths } from '@/fetchers'

export function useLoanAmountConfiguration () {
  const error = ref('')
  const isLoading = ref(false)

  const loanPurposeOptions = ref([])
  const repaymentPeriodOptions = ref([])
  const termMonthsOptions = ref([])

  async function load () {
    try {
      isLoading.value = true

      const [
        loanPurposes,
        repaymentPeriods,
        termMonths,
      ] = await Promise.all(
        [
          fetchLoanPurposes(),
          fetchRequestedPaymentPeriods(),
          fetchRequestedTermMonths(),
        ]
      )

      loanPurposeOptions.value = loanPurposes
      repaymentPeriodOptions.value = repaymentPeriods
      termMonthsOptions.value = termMonths
    } catch (err) {
      error.value = 'We could not load the loan options. Please reload or try again later.'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    load()
  })

  return {
    error,
    isLoading,
    loanPurposeOptions,
    repaymentPeriodOptions,
    termMonthsOptions,
  }
}
