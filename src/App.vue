<script setup>
import { ref, watch } from 'vue'
import PMT from './utils/PMT'

const error = ref('')
const isValid = ref(false)
const loanAmount = ref(0)
const repaymentAmountPerPeriod = ref(0)
const totalRepayments = ref(0)

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
