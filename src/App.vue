<script setup>

import { LOAN_AMOUNT_MAX, LOAN_AMOUNT_MIN } from './constants/loanAmountLimits'
import LoanAmountCalculator from './components/LoanAmountCalculator.vue'

</script>

<template>
  <LoanAmountCalculator
    :loan-amount-max="LOAN_AMOUNT_MAX"
    :loan-amount-min="LOAN_AMOUNT_MIN"
  />
</template>
