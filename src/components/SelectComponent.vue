<script setup>
import { defineEmits } from 'vue'

const {
  id,
  name,
  options,
} = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Array,
    required: true,
    validator: (value) => value.every(option =>
      typeof option === 'object' &&
      'value' in option &&
      'label' in option
    ),
  },
  name: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: () => `select-${Math.random().toString(36)}`,
  },
})

const emit = defineEmits(['update:modelValue'])

const handleChange = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div>
    <select
      :id="id"
      :name="name"
      :value="modelValue"
      class="block w-full rounded-md border border-stone-100 bg-stone-50/50 px-2 py-1 focus:border-emerald-500 focus:bg-white focus:shadow-sm focus:outline-none focus:ring-emerald-500"
      @change="handleChange"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
