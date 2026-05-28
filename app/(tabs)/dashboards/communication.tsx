import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'
import { useMission } from '@/contexts/MissionContext'
import { useTheme } from '@/contexts/ThemeContext'
import { MetricCard } from '@/components/MetricCard'
import { GaugeBar } from '@/components/GaugeBar'

export default function CommunicationScreen() {
  const { missionData, thresholds } = useMission()
  const { colors } = useTheme()
  const { communication } = missionData

  const signalStatus =
    communication.signal < thresholds.minSignal ? 'critical' : 'ok'
  const latencyStatus =
    communication.latency > thresholds.maxLatency ? 'critical' : 'ok'

  const linkLabel =
    communication.linkQuality >= 70
      ? 'ONLINE'
      : communication.linkQuality >= 40
      ? 'DEGRADED'
      : 'LOST'
  const linkColor =
    linkLabel === 'ONLINE'
      ? colors.ok
      : linkLabel === 'DEGRADED'
      ? colors.warning
      : colors.critical

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Comunicação' }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.badge, { borderColor: linkColor, backgroundColor: linkColor + '22' }]}>
          <Text style={[styles.badgeText, { color: linkColor }]}>● {linkLabel}</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>MÉTRICAS</Text>
        <View style={styles.row}>
          <MetricCard label="Sinal" value={communication.signal} unit="dBm" status={signalStatus} />
          <MetricCard label="Latência" value={communication.latency} unit="ms" status={latencyStatus} />
          <MetricCard label="Qualidade" value={communication.linkQuality} unit="%" status="ok" />
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <GaugeBar label="Qualidade do Link" value={communication.linkQuality} max={100} unit="%" />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16 },
  badge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, alignSelf: 'flex-start', marginBottom: 16 },
  badgeText: { fontWeight: '700', fontSize: 14, letterSpacing: 1 },
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 11, letterSpacing: 1, marginBottom: 8, marginTop: 8 },
  card: { borderRadius: 12, borderWidth: 1, padding: 16, marginBottom: 12 },
})
