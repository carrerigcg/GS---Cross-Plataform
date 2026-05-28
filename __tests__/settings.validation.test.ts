jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

import { validateThresholds } from '@/app/(tabs)/settings'

describe('validateThresholds', () => {
  it('passes with valid values', () => {
    const errors = validateThresholds({
      maxTemperature: '80',
      minPressure: '10',
      minBattery: '20',
      minSignal: '-90',
      maxLatency: '500',
    })
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('fails when maxTemperature is empty', () => {
    const errors = validateThresholds({
      maxTemperature: '',
      minPressure: '10',
      minBattery: '20',
      minSignal: '-90',
      maxLatency: '500',
    })
    expect(errors.maxTemperature).toBeDefined()
  })

  it('fails when minBattery is above 100', () => {
    const errors = validateThresholds({
      maxTemperature: '80',
      minPressure: '10',
      minBattery: '150',
      minSignal: '-90',
      maxLatency: '500',
    })
    expect(errors.minBattery).toBeDefined()
  })

  it('fails when maxLatency is negative', () => {
    const errors = validateThresholds({
      maxTemperature: '80',
      minPressure: '10',
      minBattery: '20',
      minSignal: '-90',
      maxLatency: '-10',
    })
    expect(errors.maxLatency).toBeDefined()
  })
})
