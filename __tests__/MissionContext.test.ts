jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

import { checkThresholds } from '@/contexts/MissionContext'
import { Thresholds, MissionData, MetricStatus } from '@/types/mission'

const thresholds: Thresholds = {
  maxTemperature: 80,
  minPressure: 10,
  minBattery: 20,
  minSignal: -90,
  maxLatency: 500,
}

const okData: MissionData = {
  sensors: { temperature: 50, pressure: 12, radiation: 10 },
  energy: { battery: 60, solarOutput: 500, consumption: 200 },
  communication: { signal: -70, latency: 200, linkQuality: 90 },
  orbital: { altitude: 400, velocity: 7.66, inclination: 51.6 },
}

describe('checkThresholds', () => {
  it('returns no alerts when all metrics are ok', () => {
    const alerts = checkThresholds(okData, thresholds, {})
    expect(alerts).toHaveLength(0)
  })

  it('generates warning when temperature is slightly above threshold', () => {
    const data = { ...okData, sensors: { ...okData.sensors, temperature: 85 } }
    const alerts = checkThresholds(data, thresholds, {})
    expect(alerts).toHaveLength(1)
    expect(alerts[0].severity).toBe('warning')
    expect(alerts[0].type).toBe('sensor')
  })

  it('generates critical when temperature is far above threshold', () => {
    const data = { ...okData, sensors: { ...okData.sensors, temperature: 100 } }
    const alerts = checkThresholds(data, thresholds, {})
    expect(alerts[0].severity).toBe('critical')
  })

  it('does not duplicate alert if metric status unchanged', () => {
    const data = { ...okData, sensors: { ...okData.sensors, temperature: 85 } }
    const prevStatuses: Record<string, MetricStatus> = { temperature: 'warning' }
    const alerts = checkThresholds(data, thresholds, prevStatuses)
    expect(alerts).toHaveLength(0)
  })

  it('generates alert when battery drops below threshold', () => {
    const data = { ...okData, energy: { ...okData.energy, battery: 15 } }
    const alerts = checkThresholds(data, thresholds, {})
    expect(alerts[0].type).toBe('energy')
  })
})
