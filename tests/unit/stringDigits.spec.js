import { countDigits, findPositionOfNthDigit, isDigit, removeNonDigits } from '@/utils/stringDigits'

const numDigits = Array.from({ length: 10 }).map((_, i) => i)
const strDigits = numDigits.map(d => `${d}`)
const otherCharacters = 'abcdefGHIJKL$%^&* '.split('')

// isDigit tests done first because it is a dependency of the others
describe('isDigit', () => {
  const cases = [
    ...numDigits.map(x => [x, true]),
    ...strDigits.map(x => [x, true]),
    ...otherCharacters.map(x => [x, false]),
  ]

  it.each(cases)(
    '%# given %s, returns %s',
    (x, result) => expect(isDigit(x)).toBe(result)
  )
})

// removeNonDigits tested before countDigits because it is a dependency of countDigits
describe('removeNonDigits', () => {
  it.each(strDigits)('given single digit character %s, returns same string', (x) => expect(removeNonDigits(x)).toBe(x))
  it.each(otherCharacters)('given single non-digit character %s, returns empty string', (x) => expect(removeNonDigits(x)).toBe(''))

  it('given a string with multiple characters and one digit, returns the digit', () => expect(removeNonDigits('abc 1df ')).toBe('1'))
  it('given a string with no digits, returns empty string', () => expect(removeNonDigits('abc df ghijk$% ')).toBe(''))

  it('given a long formatted currency string, returns just the digits', () => expect(removeNonDigits('$1,234,567,890.12')).toBe('123456789012'))
  it('given a long string with multiple sets of digits, returns just the digits', () => expect(removeNonDigits('#$%ghtyp $1,23 asjlk4,56 polks7,890 qrts.12 koaspmel $')).toBe('123456789012'))
})

describe('countDigits', () => {
  it('given a single digit in a string, returns 1', () => expect(countDigits('1')).toBe(1))
  it('given a single digit in multi character string, returns 1', () => expect(countDigits('abc 1df ')).toBe(1))
  it('given a one character string with no digits, returns 0', () => expect(countDigits('a')).toBe(0))
  it('given a long string with no digits, returns 0', () => expect(countDigits('abcdefghIJKLM%$^&@# QWSDTD@~!')).toBe(0))
  it('given a long formatted currency, correctly counts the digits', () => expect(countDigits('$1,234,567,890.12')).toBe(12))
  it('given a long string containing a formatted currency, correctly counts the digits', () => expect(countDigits('#$%ghtyp $1,234,567,890.12 koaspmel $')).toBe(12))
  it('given a long string with multiple sets of digits, correctly counts all of them', () => expect(countDigits('#$%ghtyp $1,23 asjlk4,56 polks7,890 qrts.12 koaspmel $')).toBe(12))
})

describe('findPositionOfNthDigit', () => {
  it('given an empty string, returns -1', () => expect(findPositionOfNthDigit('', 1)).toBe(-1))
  it('given a string without digits, returns -1', () => expect(findPositionOfNthDigit('abcbdefg', 1)).toBe(-1))
  it('given a one character string of a digit and asked to find the 1st digit, returns 0', () => expect(findPositionOfNthDigit('7', 1)).toBe(0))
  it('given a one character string of a digit and asked to find the 2nd digit, returns -1', () => expect(findPositionOfNthDigit('7', 2)).toBe(-1))
  it('given "#$%ghtyp $1,23 asjlk4," and asked to find the 4th digit, correctly returns 20', () => expect(findPositionOfNthDigit('#$%ghtyp $1,23 asjlk4', 4)).toBe(20))
})
