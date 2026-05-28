import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Alert,
  AlertSeverity,
  AlertType,
  MetricStatus,
  MissionData,
  Thresholds,
} from '@/types/mission'
import { DEFAULT_THRESHOLDS } from '@/constants/thresholds'
import { loadFromStorage, saveToStorage } from '@/hooks/useAsyncStorage'

const THRESHOLDS_KEY = '@orbitsense:thresholds'
const HISTORY_KEY = '@orbitsense:alert_history'
const MAX_ALERTS = 50
const TICK_INTERVAL = 2000

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function nextData(prev: MissionData): MissionData {
  const vary = (val: number, delta: number) =>
    val + (Math.random() - 0.5) * delta

  return {
    sensors: {
      temperature: Math.max(10, Math.min(110, vary(prev.sensors.temperature, 4))),
      pressure: Math.max(4, Math.min(18, vary(prev.sensors.pressure, 0.5))),
      radiation: Math.max(0, Math.min(60, vary(prev.sensors.radiation, 2))),
    },
    energy: {
      battery: Math.max(0, Math.min(100, vary(prev.energy.battery, 2))),
      solarOutput: Math.max(0, Math.min(1000, vary(prev.energy.solarOutput, 30))),
      consumption: Math.max(50, Math.min(600, vary(prev.energy.consumption, 15))),
    },
    communication: {
      signal: Math.max(-120, Math.min(-40, vary(prev.communication.signal, 3))),
      latency: Math.max(50, Math.min(1200, vary(prev.communication.latency, 30))),
      linkQuality: Math.max(0, Math.min(100, vary(prev.communication.linkQuality, 3))),
    },
    orbital: {
      altitude: Math.max(350, Math.min(450, vary(prev.orbital.altitude, 1))),
      velocity: Math.max(7.4, Math.min(7.9, vary(prev.orbital.velocity, 0.02))),
      inclination: Math.max(50, Math.min(53, vary(prev.orbital.inclination, 0.05))),
    },
  }
}

const INITIAL_DATA: MissionData = {
  sensors: { temperature: 45, pressure: 12, radiation: 15 },
  energy: { battery: 75, solarOutput: 600, consumption: 250 },
  communication: { signal: -72, latency: 220, linkQuality: 88 },
  orbital: { altitude: 408, velocity: 7.66, inclination: 51.6 },
}

function getStatus(isViolation: boolean, deviation: number): MetricStatus {
  if (!isViolation) return 'ok'
  return deviation >= 0.2 ? 'critical' : 'warning'
}

export function checkThresholds(
  data: MissionData,
  thresholds: Thresholds,
  prevStatuses: Record<string, MetricStatus>
): Alert[] {
  const now = new Date()
  const newAlerts: Alert[] = []

  const check = (
    key: string,
    value: number,
    threshold: number,
    overThreshold: boolean,
    type: AlertType,
    message: string
  ) => {
    const deviation = overThreshold
      ? Math.abs(value - threshold) / Math.abs(threshold || 1)
      : 0
    const status = getStatus(overThreshold, deviation)
    const prev = prevStatuses[key] ?? 'ok'
    if (status !== 'ok' && status !== prev) {
      newAlerts.push({
        id: `${key}-${now.getTime()}`,
        type,
        severity: status as AlertSeverity,
        message,
        value: Math.round(value * 10) / 10,
        timestamp: now,
      })
    }
    return status
  }

  check(
    'temperature',
    data.sensors.temperature,
    thresholds.maxTemperature,
    data.sensors.temperature > thresholds.maxTemperature,
    'sensor',
    `Temperatura crítica: ${data.sensors.temperature.toFixed(1)}°C`
  )
  check(
    'pressure',
    data.sensors.pressure,
    thresholds.minPressure,
    data.sensors.pressure < thresholds.minPressure,
    'sensor',
    `Pressão baixa: ${data.sensors.pressure.toFixed(1)} kPa`
  )
  check(
    'battery',
    data.energy.battery,
    thresholds.minBattery,
    data.energy.battery < thresholds.minBattery,
    'energy',
    `Bateria baixa: ${data.energy.battery.toFixed(1)}%`
  )
  check(
    'signal',
    data.communication.signal,
    thresholds.minSignal,
    data.communication.signal < thresholds.minSignal,
    'communication',
    `Sinal fraco: ${data.communication.signal.toFixed(1)} dBm`
  )
  check(
    'latency',
    data.communication.latency,
    thresholds.maxLatency,
    data.communication.latency > thresholds.maxLatency,
    'communication',
    `Latência alta: ${data.communication.latency.toFixed(0)} ms`
  )

  return newAlerts
}

function computeStatuses(
  data: MissionData,
  thresholds: Thresholds
): Record<string, MetricStatus> {
  const s = (over: boolean, deviation: number): MetricStatus =>
    getStatus(over, deviation)
  const dev = (v: number, t: number) => Math.abs(v - t) / Math.abs(t || 1)

  return {
    temperature: s(
      data.sensors.temperature > thresholds.maxTemperature,
      dev(data.sensors.temperature, thresholds.maxTemperature)
    ),
    pressure: s(
      data.sensors.pressure < thresholds.minPressure,
      dev(data.sensors.pressure, thresholds.minPressure)
    ),
    battery: s(
      data.energy.battery < thresholds.minBattery,
      dev(data.energy.battery, thresholds.minBattery)
    ),
    signal: s(
      data.communication.signal < thresholds.minSignal,
      dev(data.communication.signal, thresholds.minSignal)
    ),
    latency: s(
      data.communication.latency > thresholds.maxLatency,
      dev(data.communication.latency, thresholds.maxLatency)
    ),
  }
}

interface MissionContextType {
  missionData: MissionData
  alerts: Alert[]
  thresholds: Thresholds
  updateThresholds: (t: Thresholds) => void
  clearAlerts: () => void
}

const MissionContext = createContext<MissionContextType>({
  missionData: INITIAL_DATA,
  alerts: [],
  thresholds: DEFAULT_THRESHOLDS,
  updateThresholds: () => {},
  clearAlerts: () => {},
})

export function MissionProvider({ children }: { children: React.ReactNode }) {
  const [missionData, setMissionData] = useState<MissionData>(INITIAL_DATA)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [thresholds, setThresholds] = useState<Thresholds>(DEFAULT_THRESHOLDS)
  const metricStatuses = useRef<Record<string, MetricStatus>>({})
  const dataRef = useRef(missionData)
  dataRef.current = missionData

  useEffect(() => {
    loadFromStorage<Thresholds>(THRESHOLDS_KEY).then((saved) => {
      if (saved) setThresholds(saved)
    })
    loadFromStorage<Alert[]>(HISTORY_KEY).then((saved) => {
      if (saved) {
        const parsed = saved.map((a) => ({ ...a, timestamp: new Date(a.timestamp) }))
        setAlerts(parsed)
      }
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setMissionData((prev) => {
        const next = nextData(prev)
        const newAlerts = checkThresholds(next, thresholds, metricStatuses.current)
        metricStatuses.current = computeStatuses(next, thresholds)

        if (newAlerts.length > 0) {
          setAlerts((prev) => {
            const updated = [...newAlerts, ...prev].slice(0, MAX_ALERTS)
            saveToStorage(HISTORY_KEY, updated)
            return updated
          })
        }
        return next
      })
    }, TICK_INTERVAL)
    return () => clearInterval(interval)
  }, [thresholds])

  const updateThresholds = (t: Thresholds) => {
    setThresholds(t)
    saveToStorage(THRESHOLDS_KEY, t)
  }

  const clearAlerts = () => {
    setAlerts([])
    saveToStorage(HISTORY_KEY, [])
  }

  return (
    <MissionContext.Provider
      value={{ missionData, alerts, thresholds, updateThresholds, clearAlerts }}
    >
      {children}
    </MissionContext.Provider>
  )
}

export function useMission() {
  return useContext(MissionContext)
}
