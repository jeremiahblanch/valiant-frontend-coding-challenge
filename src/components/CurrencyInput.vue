<script setup>
import { nextTick, ref, watch } from 'vue'

import { limitNumber } from '@/utils/limitNumber'
import { countDigits, findPositionOfNthDigit, isDigit, removeNonDigits } from '@/utils/stringDigits'
import { useFormat } from '@/composables/useFormat'
const { formatNumber } = useFormat()

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: Infinity,
  },
  min: {
    type: Number,
    default: Infinity * -1,
  },
})

const limit = (value) => limitNumber(value, props.min, props.max)

// store a local version of the value as a formatted string
const innerString = ref(formatNumber(limit(props.modelValue)))

// update the internal value when model changes
watch(() => props.modelValue, (value) => {
  if (!isNaN(value)) {
    // if we receive NaN just ignore it, as it will be because the user is entering a value
    innerString.value = formatNumber(value)
  }
})

// Event handlers
const handleInput = (ev, wantEnforceLimit = false) => {
  let value = ev.target.value.trim() // in case this was pasted and has spaces
  value = value.startsWith('0') ? value.substring(1) : value // remove leading 0

  // Look at the cursor position: count only the digits up to selectionStart / selectionEnd
  const selStartWithinDigits = countDigits(value.substring(0, ev.target.selectionStart))
  const selEndWithinDigits = countDigits(value.substring(0, ev.target.selectionEnd))

  // get numeric value from string
  const stringOfDigits = removeNonDigits(value)
  const numeric = Number(stringOfDigits)
  const limited = limit(numeric)

  if (limited === numeric || wantEnforceLimit) {
    emit('update:modelValue', limited)
  } else {
    // if the value is out of bounds but wantEnforceLimit is false, emit NaN up to the parent
    // and let the user keep typing
    emit('update:modelValue', NaN)
  }

  // update display
  innerString.value = isNaN(numeric) ? '0' : formatNumber(numeric)

  // innerString will have commas and other characters, depending on what formatNumber has returend
  // we want to make sure the caret is back at the right spot, after the character just typed
  // we stored which digit (by count) our selection was at, so count the digits and add 1 to that value
  const newSelStart = findPositionOfNthDigit(innerString.value, selStartWithinDigits) + 1
  const newSelEnd = findPositionOfNthDigit(innerString.value, selEndWithinDigits) + 1

  nextTick().then(() => {
    ev.target.selectionStart = newSelStart
    ev.target.selectionEnd = newSelEnd
  })
}

const handleKeyDown = (ev) => {
  // Ensure that non digits don't get recorded

  if ((ev.altKey || ev.ctrlKey || ev.metaKey || ev.key.length > 1)) {
    // special keys, just let them be handled normally
    return
  }

  if (!isDigit(ev.key)) {
    // non-special key that is not a digit - prevent event
    ev.preventDefault()
  }
}
</script>

<template>
  <input
    type="text"
    class="inline-block border-b-2 border-dashed border-b-emerald-500 px-2 py-1 text-center text-lg font-bold tracking-wide text-emerald-600 focus:text-emerald-700 focus:outline-none"
    :value="innerString"
    @blur="(ev) => handleInput(ev, true)"
    @focus="handleInput"
    @input="handleInput"
    @keydown="handleKeyDown"
  >
</template>
