import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'
import { LineChart } from 'react-native-chart-kit'
import { useMission } from '@/contexts/MissionContext'
import { useTheme } from '@/contexts/ThemeContext'
import { MetricCard } from '@/components/MetricCard'

const MAX_HISTORY = 20
const WIDTH = Dimensions.get('window').width - 32

export default function OrbitalScreen() {
  const { missionData } = useMission()
  const { colors } = useTheme()
  const { orbital } = missionData
  const [altHistory, setAltHistory] = useState<number[]>([orbital.altitude])

  useEffect(() => {
    setAltHistory((prev) => {
      const next = [...prev, orbital.altitude]
      return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next
    })
  }, [orbital.altitude])

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Estabilidade Orbital' }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PARÂMETROS ORBITAIS</Text>
        <View style={styles.row}>
          <MetricCard label="Altitude" value={orbital.altitude} unit="km" status="ok" />
          <MetricCard label="Velocidade" value={orbital.velocity} unit="km/s" status="ok" />
          <MetricCard label="Inclinação" value={orbital.inclination} unit="°" status="ok" />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ALTITUDE — HISTÓRICO</Text>
        <LineChart
          data={{
            labels: [],
            datasets: [{ data: altHistory.length > 1 ? altHistory : [400, 400] }],
          }}
          width={WIDTH}
          height={200}
          withDots={false}
          withInnerLines={false}
          chartConfig={{
            backgroundColor: colors.cardBackground,
            backgroundGradientFrom: colors.cardBackground,
            backgroundGradientTo: colors.cardBackground,
            color: () => colors.ok,
            labelColor: () => colors.textSecondary,
            propsForBackgroundLines: { stroke: colors.border },
          }}
          style={{ borderRadius: 12 }}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16 },
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 11, letterSpacing: 1, marginBottom: 8, marginTop: 8 },
})
