<script setup>
import { onMounted, ref, watch } from 'vue'
import PMT from './utils/PMT'
import { fetchLoanPurposes, fetchRequestedPaymentPeriods, fetchRequestedTermMonths } from './fetchers'

const error = ref('')
const isLoadingConfig = ref(false)
const isValid = ref(false)
const loanAmount = ref(0)
const repaymentAmountPerPeriod = ref(0)
const totalRepayments = ref(0)

const possibleLoanPurposes = ref([])
const possibleRepaymentPeriods = ref([])
const possibleTermMonths = ref([])

function recalc (principal) {
  const countPeriods = 24 // TODO
  const periodsPerYear = 12 // TODO
  const ratePerTerm = 0.07 / periodsPerYear // TODO

  const result = PMT(
    ratePerTerm,
    countPeriods,
    principal
  )

  isValid.value = !isNaN(result)
  if (isValid.value) {
    const repayment = result * -1

    repaymentAmountPerPeriod.value = Math.ceil(repayment)
    totalRepayments.value = Math.ceil(repayment * countPeriods)
  } else {
    error.value = 'Could not calculate'
  }
}

function clear () {
  error.value = ''
  isValid.value = false
  repaymentAmountPerPeriod.value = 0
  totalRepayments.value = 0
}

async function fetchConfig () {
  try {
    isLoadingConfig.value = true

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

    possibleLoanPurposes.value = loanPurposes
    possibleRepaymentPeriods.value = repaymentPeriods
    possibleTermMonths.value = termMonths
  } catch (err) {
    console.error(err.message)
    error.value = 'There was an error loading the configuration. Please reload or try again later'
  } finally {
    isLoadingConfig.value = false
  }
}

watch(loanAmount, (newValue) => {
  clear()
  if (isNaN(Number(newValue))) {
    error.value = 'Please enter a number'
    isValid.value = false
  }
  if (newValue > 1000) {
    recalc(newValue)
  }
})

// Call the fetch function when component mounts
onMounted(() => {
  fetchConfig()
})

</script>

<template>
  <div>
    <label
      for="loanAmountInput"
    >
      Loan Amount
    </label>
    <input
      id="loanAmountInput"
      v-model="loanAmount"
      type="text"
    >
  </div>

  <pre>
    {{ possibleLoanPurposes }}
    {{ possibleRepaymentPeriods }}
    {{ possibleTermMonths }}
  </pre>

  <div
    v-if="error"
    class="text-red-500"
  >
    Error: {{ error }}
  </div>

  <div
    v-else-if="isValid"
  >
    <p>{{ repaymentAmountPerPeriod }} monthly repayments</p>
    <p>{{ totalRepayments }} total repayments</p>
  </div>
</template>
