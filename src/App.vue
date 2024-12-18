<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import PMT from './utils/PMT'
import { formatCurrency } from './utils/formatCurrency'
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
const chosenRepaymentPeriod = computed(() => possibleRepaymentPeriods.value.find(({ value }) => chosenRepaymentPeriodValue.value === `${value}`))

function recalc () {
  try {
    // TODO check vwarious error problems
    const annualRate = chosenLoanPurpose.value.annualRate
    const periodsPerYear = chosenRepaymentPeriodValue.value
    const countPeriods = chosenTermMonthsValue.value / 12 * periodsPerYear

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

watch([chosenLoanPurposeValue, chosenRepaymentPeriodValue, chosenTermMonthsValue], (newValues) => {
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
  <div class="container mx-auto flex justify-center">
    <div class="flex flex-col items-center gap-2">
      <div
        v-if="isLoadingConfig"
        class="p-4 text-center"
      >
        Fetching configuration, please wait
      </div>
      <template v-else>
        <div class="flex items-center gap-1 px-6">
          <span>I need</span>
          <span>
            <span>$</span>
            <label
              class="sr-only"
              for="loanAmountInput"
            >
              Loan Amount
            </label>
            <input
              id="loanAmountInput"
              v-model="loanAmount"
              class="w-36"
              type="text"
            >
          </span>
          <span>for</span>
          <SelectComponent
            v-model="chosenLoanPurposeValue"
            class="w-48"
            :options="possibleLoanPurposes"
          />
        </div>
        <div class="flex items-center gap-1 px-6">
          <span>repaid</span>
          <SelectComponent
            v-model="chosenRepaymentPeriodValue"
            class="w-48"
            :options="possibleRepaymentPeriods"
          />

          <span>over</span>

          <SelectComponent
            v-model="chosenTermMonthsValue"
            class="w-48"
            :options="possibleTermMonths"
          />
        </div>
      </template>

      <div
        v-if="error || isValid"
        class="my-4 w-full border-b"
      />

      <div
        v-if="error"
        class="text-red-500"
      >
        Error: {{ error }}
      </div>

      <div
        v-else-if="isValid"
        class="flex flex-col items-center gap-1"
      >
        <p class="text-center text-green-600">
          <span class="rounded-md bg-green-50 px-2 py-0.5">
            {{ formatCurrency(repaymentAmountPerPeriod) }}
          </span>
          <span class="p-1 text-sm">
            {{ chosenRepaymentPeriod?.label }}
            repayments
          </span>
        </p>
        <p class="text-sm text-stone-500">
          <span class="rounded-md bg-stone-50 px-2 py-0.5">

            {{ formatCurrency(totalRepayments) }}
          </span>
          Total repayments
        </p>
      </div>
    </div>
  </div>
</template>
