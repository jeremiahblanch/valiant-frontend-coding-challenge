<script setup>

import { LOAN_AMOUNT_MAX, LOAN_AMOUNT_MIN } from './constants/loanAmountLimits'
import LoanRepaymentCalculator from './components/LoanRepaymentCalculator.vue'

</script>

<template>
  <LoanRepaymentCalculator
    :loan-amount-max="LOAN_AMOUNT_MAX"
    :loan-amount-min="LOAN_AMOUNT_MIN"
  />
</template>
