<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import PMT from './utils/PMT'
import { fetchLoanPurposes, fetchRequestedPaymentPeriods, fetchRequestedTermMonths } from './fetchers'
import SelectComponent from './components/SelectComponent.vue'

const error = ref('')
const isLoadingConfig = ref(false)
const isValid = ref(false)
const loanAmount = ref(0)
const repaymentAmountPerPeriod = ref(0)
const totalRepayments = ref(0)

const possibleLoanPurposes = ref([])
const possibleRepaymentPeriods = ref([])
const possibleTermMonths = ref([])

const chosenLoanPurposeValue = ref()
const chosenRepaymentPeriodValue = ref()
const chosenTermMonthsValue = ref()

/// Computed
const chosenLoanPurpose = computed(() => possibleLoanPurposes.value.find(({ value }) => value === chosenLoanPurposeValue.value))

function recalc () {
  try {
    // TODO check vwarious error problems
    const annualRate = chosenLoanPurpose.value.annualRate
    const totalMonths = chosenRepaymentPeriodValue.value
    const periodsPerYear = chosenRepaymentPeriodValue.value

    const countPeriods = totalMonths / 12 * periodsPerYear

    const ratePerTerm = annualRate / periodsPerYear

    const result = PMT(
      ratePerTerm,
      countPeriods,
      loanAmount.value
    )

    isValid.value = !isNaN(result)
    if (isValid.value) {
      const repayment = result * -1

      repaymentAmountPerPeriod.value = Math.ceil(repayment)
      totalRepayments.value = Math.ceil(repayment * countPeriods)
    } else {
      error.value = 'Could not calculate'
    }
  } catch (err) {
    error.value = `Could not calculate: ${err.message}`
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

/// Watchers
watch(loanAmount, (newValue) => {
  clear()
  if (isNaN(Number(newValue)) || newValue < 1000 || newValue > 20000000) {
    error.value = 'Please enter a number between 1,000 and 20,000,000'
    isValid.value = false
    return
  }

  recalc(newValue)
})

watch([chosenLoanPurposeValue, chosenRepaymentPeriodValue, chosenRepaymentPeriodValue], (newValues) => {
  clear()
  if (newValues.every(v => !!v)) {
    recalc()
  }
})

// Lifecycle Hooks
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

  <div v-if="isLoadingConfig">
    Fetching configuration, please wait
  </div>
  <div v-else>
    <SelectComponent
      v-model="chosenLoanPurposeValue"
      :options="possibleLoanPurposes"
    />
    <SelectComponent
      v-model="chosenTermMonthsValue"
      :options="possibleTermMonths"
    />
    <SelectComponent
      v-model="chosenRepaymentPeriodValue"
      :options="possibleRepaymentPeriods"
    />
  </div>

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
