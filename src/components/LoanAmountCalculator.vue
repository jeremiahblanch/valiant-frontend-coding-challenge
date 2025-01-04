<script setup>
import { computed, ref } from 'vue'
import CurrencyInput from '@/components/CurrencyInput.vue'
import SelectInput from '@/components/SelectInput.vue'

import { useFormat } from '@/composables/useFormat'
import { useLoanAmountConfiguration } from '@/composables/useLoanAmountConfiguration'
import PMT from '@/utils/PMT'
import SelectInputSkeleton from './SelectInputSkeleton.vue'

const styles = {
  fieldRow: 'grid w-full grid-cols-[6rem_1fr] items-center gap-4 sm:flex sm:w-auto',
}

const { formatCurrency, formatNumber } = useFormat()
const {
  error: configError,
  isLoading: isLoadingConfig,
  loanPurposeOptions,
  repaymentPeriodOptions,
  termMonthsOptions,
} = useLoanAmountConfiguration()

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

// User input values
const loanAmount = ref(props.loanAmountMin)
const chosenLoanPurposeValue = ref()
const chosenRepaymentPeriodValue = ref()
const chosenTermMonthsValue = ref()

/// Computeds
const calculation = computed(() => {
  if (isNaN(Number(loanAmount.value))) {
    return {
      error: `Please enter an amount between ${formatNumber(props.loanAmountMin)} and ${formatNumber(props.loanAmountMax)}.`,
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

  const repaymentPerPeriod = -1 * PMT(
    annualRate / periodsPerYear,
    totalPeriods,
    loanAmount.value
  )

  const totalRepayments = repaymentPerPeriod * totalPeriods

  return {
    repaymentPerPeriod,
    totalRepayments,
  }
})

const periodLabel = computed(() => {
  const chosenRepaymentPeriod = repaymentPeriodOptions.value.find(({ value }) => chosenRepaymentPeriodValue.value === `${value}`)

  return chosenRepaymentPeriod?.label
})

</script>

<template>
  <div class="mx-auto flex max-w-xl justify-center">
    <div class="flex flex-col items-center gap-2 py-6">
      <div class="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:px-6">
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
            <span>$</span>
            <CurrencyInput
              id="loanAmountInput"
              v-model="loanAmount"
              class="inline-block w-44 border-b-2 border-dashed border-b-emerald-500 px-2 py-1 text-center text-lg font-bold tracking-wide text-emerald-600 focus:border-b-emerald-700 focus:text-emerald-700 focus:outline-none sm:w-32"
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
            class="w-48"
            :disabled="!termMonthsOptions.length"
            :options="termMonthsOptions"
          />
        </div>
      </div>

      <div class="mt-4 flex min-h-24 w-full flex-col items-center justify-center gap-1 border-t px-6 text-center">
        <div
          v-if="isLoadingConfig || configError || calculation.error"
          class="text-sm text-stone-400"
        >
          {{ (isLoadingConfig ? 'Please wait while we load the loan options...' : configError) || calculation.error }}
        </div>

        <template v-else>
          <p class="text-lg text-emerald-600">
            <span class="text-xl font-medium tracking-wide">
              {{ formatCurrency(calculation.repaymentPerPeriod) }}
            </span>
            <span class="p-1">
              {{ periodLabel }}
              repayments
            </span>
          </p>
          <p class="text-stone-500">
            <span class="font-medium tracking-wide">

              {{ formatCurrency(calculation.totalRepayments) }}
            </span>
            Total repayments
          </p>
        </template>
      </div>
    </div>
  </div>
</template>
