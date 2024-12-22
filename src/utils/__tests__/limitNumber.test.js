import { expect, test } from 'vitest'
import { limitNumber } from '@/utils/limitNumber.js'

test('given a value below the minimum, returns the minimum', () => expect(limitNumber(1, 2, 3)).toBe(2))
test('given a value above the maximum, returns the maximum', () => expect(limitNumber(4, 2, 3)).toBe(3))
test('given a value with the bounds, returns that value unchanged', () => expect(limitNumber(2, 1, 3)).toBe(2))
test('given a minimum of minus infinity, works as expected', () => expect(limitNumber(1, Infinity * -1, 3)).toBe(1))
test('given a maximum of infinity, works as expected', () => expect(limitNumber(1, 0, Infinity)).toBe(1))
test('throws an error if minimum > maximum', () => expect(() => limitNumber(1, 3, 2)).toThrow('Min must be less than or equal to max'))
