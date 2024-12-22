<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import PMT from './utils/PMT'
import { fetchLoanPurposes, fetchRequestedPaymentPeriods, fetchRequestedTermMonths } from './fetchers'
import SelectComponent from './components/SelectInput.vue'
import CurrencyInput from './components/CurrencyInput.vue'
import SelectInput from './components/SelectInput.vue'

import { useFormat } from './composables/useFormat'

const { formatCurrency } = useFormat()

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
  if (!chosenLoanPurpose.value || !chosenRepaymentPeriod.value || !chosenTermMonthsValue.value) {
    isValid.value = false
    return
  }

  try {
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
    error.value = 'We could not load the loan options. Please reload or try again later.'
  } finally {
    isLoadingConfig.value = false
  }
}

/// Watchers
watch(loanAmount, (newValue) => {
  clear()
  if (isNaN(Number(newValue))) {
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
    <div class="flex flex-col items-center gap-2 py-6">
      <div class="flex items-center gap-4 px-6">
        <span>I need</span>
        <span>

          <label
            class="sr-only"
            for="loanAmountInput"
          >
            Loan Amount
          </label>
          <span>$</span>
          <CurrencyInput
            id="loanAmountInput"
            v-model="loanAmount"
            class="w-32"
            :min="1000"
            :max="20000000"
          />
        </span>
        <span>for</span>
        <SelectInput
          v-model="chosenLoanPurposeValue"
          class="w-48"
          :options="possibleLoanPurposes"
        />
      </div>
      <div class="flex items-center gap-4 px-6">
        <span>repaid</span>
        <SelectInput
          v-model="chosenRepaymentPeriodValue"
          class="w-48"
          :options="possibleRepaymentPeriods"
        />

        <span>over</span>

        <SelectInput
          v-model="chosenTermMonthsValue"
          class="w-48"
          :options="possibleTermMonths"
        />
      </div>

      <div class="mt-4 flex min-h-24 w-full flex-col items-center justify-center gap-1 border-t text-center">
        <div
          v-if="error || isLoadingConfig"
          class="text-sm text-stone-300"
        >
          {{ isLoadingConfig ? 'Please wait while we load the loan options...' : error }}
        </div>
        <template
          v-else-if="isValid"
        >
          <p class="text-emerald-600">
            <span class="rounded-md bg-emerald-50 px-2 py-0.5 text-lg">
              {{ formatCurrency(repaymentAmountPerPeriod) }}
            </span>
            <span class="p-1">
              {{ chosenRepaymentPeriod?.label }}
              repayments
            </span>
          </p>
          <p class="text-stone-500">
            <span class="rounded-md bg-stone-50 px-2 py-0.5">

              {{ formatCurrency(totalRepayments) }}
            </span>
            <span class="text-sm" />
            Total repayments
          </p>
        </template>
      </div>
    </div>
  </div>
</template>
