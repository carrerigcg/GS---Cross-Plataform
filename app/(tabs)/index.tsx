import React from 'react'
import { View, Text, ScrollView, StyleSheet, Switch } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useMission } from '@/contexts/MissionContext'
import { useTheme } from '@/contexts/ThemeContext'
import { MetricCard } from '@/components/MetricCard'
import { Ionicons } from '@expo/vector-icons'

function systemStatus(values: number[], thresholds: { warn: number; crit: number; above: boolean }[]) {
  for (let i = 0; i < values.length; i++) {
    const { warn, crit, above } = thresholds[i]
    const v = values[i]
    if (above ? v >= crit : v <= crit) return 'critical'
    if (above ? v >= warn : v <= warn) return 'warning'
  }
  return 'ok'
}

export default function HomeScreen() {
  const { missionData, alerts, thresholds } = useMission()
  const { colors, isDark, toggleTheme } = useTheme()
  const { sensors, energy, communication, orbital } = missionData

  const sensorStatus = systemStatus(
    [sensors.temperature, sensors.pressure],
    [
      { warn: thresholds.maxTemperature * 0.8, crit: thresholds.maxTemperature, above: true },
      { warn: thresholds.minPressure * 1.2, crit: thresholds.minPressure, above: false },
    ]
  )
  const energyStatus = energy.battery < thresholds.minBattery ? 'critical' : energy.battery < thresholds.minBattery * 1.5 ? 'warning' : 'ok'
  const commStatus = communication.signal < thresholds.minSignal ? 'critical' : 'ok'
  const criticalCount = alerts.filter((a) => a.severity === 'critical').length

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.accent }]}>OrbitSense</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Space Predictive Analytics
            </Text>
          </View>
          <Switch value={isDark} onValueChange={toggleTheme} thumbColor={colors.accent} />
        </View>

        {criticalCount > 0 && (
          <View style={[styles.critBadge, { backgroundColor: colors.critical + '22', borderColor: colors.critical }]}>
            <Ionicons name="alert-circle" size={18} color={colors.critical} />
            <Text style={[styles.critText, { color: colors.critical }]}>
              {criticalCount} alerta{criticalCount > 1 ? 's' : ''} crítico{criticalCount > 1 ? 's' : ''}
            </Text>
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>SISTEMAS</Text>
        <View style={styles.grid}>
          <MetricCard label="Temperatura" value={sensors.temperature} unit="°C" status={sensorStatus as any} />
          <MetricCard label="Pressão" value={sensors.pressure} unit="kPa" status={sensorStatus as any} />
          <MetricCard label="Bateria" value={energy.battery} unit="%" status={energyStatus as any} />
          <MetricCard label="Sinal" value={communication.signal} unit="dBm" status={commStatus as any} />
          <MetricCard label="Altitude" value={orbital.altitude} unit="km" status="ok" />
          <MetricCard label="Velocidade" value={orbital.velocity} unit="km/s" status="ok" />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', letterSpacing: 1 },
  subtitle: { fontSize: 12, marginTop: 2 },
  critBadge: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 16, gap: 6 },
  critText: { fontWeight: '600', fontSize: 14 },
  sectionTitle: { fontSize: 11, letterSpacing: 1, marginBottom: 8, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
})
