import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'
import { useMission } from '@/contexts/MissionContext'
import { useTheme } from '@/contexts/ThemeContext'
import { GaugeBar } from '@/components/GaugeBar'
import { MetricCard } from '@/components/MetricCard'

export default function EnergyScreen() {
  const { missionData, thresholds } = useMission()
  const { colors } = useTheme()
  const { energy } = missionData
  const batteryStatus =
    energy.battery < thresholds.minBattery
      ? 'critical'
      : energy.battery < thresholds.minBattery * 1.5
      ? 'warning'
      : 'ok'

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Energia' }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>BATERIA</Text>
        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <GaugeBar label="Nível de Bateria" value={energy.battery} max={100} unit="%" />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PRODUÇÃO / CONSUMO</Text>
        <View style={styles.row}>
          <MetricCard label="Solar" value={energy.solarOutput} unit="W" status="ok" />
          <MetricCard label="Consumo" value={energy.consumption} unit="W" status="ok" />
          <MetricCard label="Bateria" value={energy.battery} unit="%" status={batteryStatus} />
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <GaugeBar label="Produção Solar" value={energy.solarOutput} max={1000} unit=" W" />
          <GaugeBar label="Consumo dos Sistemas" value={energy.consumption} max={600} unit=" W" />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16 },
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 11, letterSpacing: 1, marginBottom: 8, marginTop: 8 },
  card: { borderRadius: 12, borderWidth: 1, padding: 16, marginBottom: 12 },
})
