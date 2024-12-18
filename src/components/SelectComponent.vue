<script setup>
import { defineEmits } from 'vue'

// Define the props with default values
const {
  id,
  name,
  options,
} = defineProps({
  // Value for v-model binding
  modelValue: {
    type: [String, Number],
    default: '',
  },
  // Array of options
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

// Define emits for v-model support
const emit = defineEmits(['update:modelValue'])

// Handle change event
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
      class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
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
