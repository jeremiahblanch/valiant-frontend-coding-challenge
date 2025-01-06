import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import CurrencyInput from '@/components/CurrencyInput.vue'
import formatNumber from '@/utils/formatNumber'

const formatNumberCurrencyAU = (value) => formatNumber(value, { locale: 'en-AU', currency: 'AUD', round: true })

vi.mock('@/composables/useFormat', () => ({
  default: () => ({
    formatNumber: formatNumberCurrencyAU,
  }),
}))

describe('CurrencyInput', () => {
  let comp
  let input

  beforeEach(() => {
    comp = mount(CurrencyInput, {
      props: {
        modelValue: 0,
      },
    })
    input = comp.find('input')
  })

  it('renders with initial value', () => {
    expect(input.element.value).toBe('0')
  })

  it('formats numbers according to locale', async () => {
    await comp.setProps({ modelValue: 1000 })
    expect(input.element.value).toBe(formatNumberCurrencyAU(1000))
  })

  it('removes leading zeros', async () => {
    await input.setValue('0099')
    expect(input.element.value).toBe(formatNumberCurrencyAU(99))
  })

  it('emits update:modelValue when input changes', async () => {
    await input.setValue('42')
    expect(comp.emitted('update:modelValue')[0]).toEqual([42])
  })

  describe('keyboard handling', () => {
    let preventDefault

    beforeEach(() => {
      preventDefault = vi.fn()
    })

    it('prevents non-digit keys', async () => {
      await input.trigger('keydown', {
        key: 'a',
        preventDefault,
      })

      expect(preventDefault).toHaveBeenCalled()
    })

    it('allows digit keys', async () => {
      await input.trigger('keydown', {
        key: '5',
        preventDefault,
      })

      expect(preventDefault).not.toHaveBeenCalled()
    })

    it('allows special keys', async () => {
      const specialKeys = [
        { key: 'Backspace', ctrlKey: false },
        { key: 'Delete', ctrlKey: false },
        { key: 'ArrowLeft', ctrlKey: false },
        { key: 'ArrowRight', ctrlKey: false },
        { key: 'a', ctrlKey: true },
        { key: 'c', ctrlKey: true },
        { key: 'v', ctrlKey: true },
      ]

      for (const keyEvent of specialKeys) {
        await input.trigger('keydown', {
          ...keyEvent,
          preventDefault,
        })
        expect(preventDefault).not.toHaveBeenCalled()
      }
    })
  })

  describe('max min support', () => {
    const max = 100
    const min = 90
    const aboveMax = `${max + 1}`
    const belowMin = `${min - 1}`
    let wrapper

    beforeEach(() => {
      wrapper = mount(defineComponent({
        components: { CurrencyInput },
        data () {
          return {
            value: 0,
          }
        },
        template: `<CurrencyInput 
          v-model="value"
          :max="${max}"
          :min="${min}"
          />`,
      }))
      input = wrapper.find('input')
    })

    it('respects max value constraint on blur', async () => {
      await input.setValue(aboveMax)
      await input.trigger('blur')
      expect(wrapper.vm.value).toBe(max)
    })

    it('respects min value constraint on blur', async () => {
      await input.setValue(belowMin)
      await input.trigger('blur')
      expect(wrapper.vm.value).toBe(min)
    })

    it('allows out-of-bounds values during typing', async () => {
      await input.setValue(belowMin)
      expect(input.element.value).toBe(belowMin)

      // when user is typing a value that is out-of-bounds, component should emit NaN
      expect(wrapper.vm.value).toBe(NaN)

      // once blur happens the component should adjust the value to within the limits
      // and the parent should receive the adjusted value
      await input.trigger('blur')
      expect(wrapper.vm.value).toBe(min)

      // our component receives the updated value from the parent
      expect(input.element.value).toBe(`${min}`)
    })
  })

  // TODO - tests for cursor position handling
})
