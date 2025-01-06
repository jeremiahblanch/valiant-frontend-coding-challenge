function limitNumber (value, min, max) {
  if (min > max) {
    throw new Error('Min must be less than or equal to max')
  }
  return Math.min(Math.max(value, min), max)
}

export default limitNumber
