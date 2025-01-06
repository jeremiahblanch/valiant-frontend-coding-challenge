const rxDigit = /[0-9]/

function countDigits (str) {
  return removeNonDigits(str).length
}

function findPositionOfNthDigit (str, n) {
  const len = str.length
  let digitCount = 0
  for (let pos = 0; pos < len; pos++) {
    if (isDigit(str.charAt(pos))) {
      digitCount++
    }

    if (digitCount >= n) {
      return pos
    }
  }

  return -1
}

function isDigit (c) {
  return (rxDigit).test(`${c}`)
}

function removeNonDigits (str) {
  return str.split('').filter(isDigit).join('')
}

export {
  countDigits,
  findPositionOfNthDigit,
  isDigit,
  removeNonDigits,
}
