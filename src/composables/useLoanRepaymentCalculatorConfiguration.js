import axios from 'axios'
import { onMounted, ref } from 'vue'
import { ENDPOINT_LOAN_PURPOSES, ENDPOINT_REQUESTED_REPAYMENT_PERIODS, ENDPOINT_REQUESTED_TERM_MONTHS } from '@/constants/endpoints'

export function useLoanRepaymentCalculatorConfiguration () {
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
          tryFetch(ENDPOINT_LOAN_PURPOSES),
          tryFetch(ENDPOINT_REQUESTED_REPAYMENT_PERIODS),
          tryFetch(ENDPOINT_REQUESTED_TERM_MONTHS),
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

async function tryFetch (url) {
  try {
    const { data } = await axios.get(url)

    return data
  } catch (err) {
    throw new Error(`Error ${err.message} fetching ${url}`)
  }
}
