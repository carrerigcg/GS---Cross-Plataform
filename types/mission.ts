// types/mission.ts
export interface MissionData {
  sensors: {
    temperature: number
    pressure: number
    radiation: number
  }
  energy: {
    battery: number
    solarOutput: number
    consumption: number
  }
  communication: {
    signal: number
    latency: number
    linkQuality: number
  }
  orbital: {
    altitude: number
    velocity: number
    inclination: number
  }
}

export type AlertType = 'sensor' | 'energy' | 'communication' | 'orbital'
export type AlertSeverity = 'info' | 'warning' | 'critical'
export type MetricStatus = 'ok' | 'warning' | 'critical'

export interface Alert {
  id: string
  type: AlertType
  severity: AlertSeverity
  message: string
  value: number
  timestamp: Date
}

export interface Thresholds {
  maxTemperature: number
  minPressure: number
  minBattery: number
  minSignal: number
  maxLatency: number
}

export interface ThresholdFormValues {
  maxTemperature: string
  minPressure: string
  minBattery: string
  minSignal: string
  maxLatency: string
}

export interface ThresholdFormErrors {
  maxTemperature?: string
  minPressure?: string
  minBattery?: string
  minSignal?: string
  maxLatency?: string
}

export interface ThemeColors {
  background: string
  surface: string
  text: string
  textSecondary: string
  accent: string
  ok: string
  warning: string
  critical: string
  border: string
  cardBackground: string
}
