// constants/thresholds.ts
import { Thresholds } from '@/types/mission'

export const DEFAULT_THRESHOLDS: Thresholds = {
  maxTemperature: 80,
  minPressure: 10,
  minBattery: 20,
  minSignal: -90,
  maxLatency: 500,
}
