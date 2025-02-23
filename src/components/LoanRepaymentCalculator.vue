<script setup>
import { computed, ref } from 'vue'

import CurrencyInput from '@/components/CurrencyInput.vue'
import SelectInput from '@/components/SelectInput.vue'
import SelectInputSkeleton from '@/components/SelectInputSkeleton.vue'

import useFormat from '@/composables/useFormat'
import useLoanRepaymentCalculatorConfiguration from '@/composables/useLoanRepaymentCalculatorConfiguration'

import PMT from '@/utils/PMT'

const styles = {
  fieldRow: 'grid w-full grid-cols-[5rem_1fr] items-center gap-4 sm:flex sm:w-auto',
}

const props = defineProps({
  loanAmountMax: {
    type: Number,
    required: true,
  },
  loanAmountMin: {
    type: Number,
    required: true,
  },
})

const { formatCurrency, formatNumber } = useFormat()
const {
  error: configError,
  isLoading: isLoadingConfig,
  loanPurposeOptions,
  repaymentPeriodOptions,
  termMonthsOptions,
} = useLoanRepaymentCalculatorConfiguration()

// User input values
const loanAmount = ref(props.loanAmountMin)
const chosenLoanPurposeValue = ref()
const chosenRepaymentPeriodValue = ref()
const chosenTermMonthsValue = ref()

/// Computeds
const calculation = computed(() => {
  if (isNaN(Number(loanAmount.value))) {
    return {
      error: `This calculator works with amounts between ${formatNumber(props.loanAmountMin)} and ${formatNumber(props.loanAmountMax)}. Your value will be adjusted to these limits.`,
    }
  }

  if (!chosenLoanPurposeValue.value || !chosenRepaymentPeriodValue.value || !chosenTermMonthsValue.value) {
    return {
      error: 'Enter a loan amount, purpose, and repayment periods and we will calculate the repayments',
    }
  }

  const { annualRate } = loanPurposeOptions.value.find(({ value }) => value === chosenLoanPurposeValue.value)
  const periodsPerYear = Number(chosenRepaymentPeriodValue.value)
  const totalPeriods = chosenTermMonthsValue.value / 12 * periodsPerYear

  const eachRepayment = -1 * PMT(
    annualRate / periodsPerYear,
    totalPeriods,
    loanAmount.value
  )

  // Fat-marker sketch specified rounding UP the cents
  // We round up the eachRepayment AFTER we have used it to calculate the total
  return {
    eachRepayment: Math.ceil(eachRepayment),
    totalRepayments: Math.ceil(eachRepayment * totalPeriods),
  }
})

const periodLabel = computed(() => {
  const chosenRepaymentPeriod = repaymentPeriodOptions.value.find(({ value }) => chosenRepaymentPeriodValue.value === `${value}`)

  return chosenRepaymentPeriod?.label
})

</script>

<template>
  <div class="mx-1 my-4 flex max-w-xl justify-center rounded-2xl border bg-white shadow-lg sm:mx-auto">
    <div class="flex flex-col items-center gap-2 pb-2 pt-6">
      <div class="flex flex-col items-center gap-4 font-medium text-stone-700 sm:flex-row sm:flex-wrap sm:justify-center sm:px-6">
        <div :class="styles.fieldRow">
          <label for="loanAmountInput">
            <span aria-hidden="true">
              I need
            </span>
            <span class="sr-only">
              Loan Amount
            </span>
          </label>

          <span>
            <span class="text-xl font-bold text-cyan-500">$</span>
            <CurrencyInput
              id="loanAmountInput"
              v-model="loanAmount"
              data-testid="loan-amount-input"
              class="w-44 sm:w-44"
              :min="props.loanAmountMin"
              :max="props.loanAmountMax"
            />
          </span>
        </div>

        <div :class="styles.fieldRow">
          <label for="loanPurposeDropdown">
            <span aria-hidden="true">
              for
            </span>
            <span class="sr-only">
              Loan Purpose
            </span>
          </label>

          <SelectInputSkeleton
            v-if="isLoadingConfig"
            class="w-48"
          />
          <SelectInput
            v-else
            id="loanPurposeDropdown"
            v-model="chosenLoanPurposeValue"
            data-testid="loan-purpose-dropdown"
            class="w-48"
            :disabled="!loanPurposeOptions.length"
            :options="loanPurposeOptions"
          />
        </div>

        <div :class="styles.fieldRow">
          <label for="repaymentPeriodDropdown">
            <span aria-hidden="true">
              repaid
            </span>
            <span class="sr-only">
              Repayment Period
            </span>
          </label>

          <SelectInputSkeleton
            v-if="isLoadingConfig"
            class="w-48"
          />
          <SelectInput
            v-else
            id="repaymentPeriodDropdown"
            v-model="chosenRepaymentPeriodValue"
            data-testid="repayment-period-dropdown"
            class="w-48"
            :disabled="!repaymentPeriodOptions.length"
            :options="repaymentPeriodOptions"
          />
        </div>

        <div :class="styles.fieldRow">
          <label for="termDropdown">
            <span aria-hidden="true">
              over
            </span>
            <span class="sr-only">
              Term of Loan
            </span>
          </label>
          <SelectInputSkeleton
            v-if="isLoadingConfig"
            class="w-48"
          />
          <SelectInput
            v-else
            id="termDropdown"
            v-model="chosenTermMonthsValue"
            data-testid="term-dropdown"
            class="w-48"
            :disabled="!termMonthsOptions.length"
            :options="termMonthsOptions"
          />
        </div>
      </div>

      <div
        class="mt-4 flex min-h-24 w-full flex-col items-center justify-center gap-2 border-t px-6 text-center"
        data-testid="result"
      >
        <div
          v-if="isLoadingConfig || configError || calculation.error"
          class="text-sm text-stone-400"
        >
          {{ (isLoadingConfig ? 'Please wait while we load the loan options...' : configError) || calculation.error }}
        </div>

        <template v-else>
          <p class="text-lg text-emerald-600 sm:text-xl">
            <span
              class="font-semibold tracking-wide"
              data-testid="each-repayment"
            >
              {{ formatCurrency(calculation.eachRepayment) }}
            </span>
            <span class="p-1">
              {{ periodLabel }}
              repayments
            </span>
          </p>
          <p class="text-stone-500 sm:text-lg">
            <span
              class="font-semibold tracking-wide"
              data-testid="total-repayments"
            >

              {{ formatCurrency(calculation.totalRepayments) }}
            </span>
            Total repayments
          </p>
        </template>
      </div>
    </div>
  </div>
</template>
