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

export default function SensorsScreen() {
  const { missionData } = useMission()
  const { colors } = useTheme()
  const { sensors } = missionData
  const [tempHistory, setTempHistory] = useState<number[]>([sensors.temperature])

  useEffect(() => {
    setTempHistory((prev) => {
      const next = [...prev, sensors.temperature]
      return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next
    })
  }, [sensors.temperature])

  const chartData = {
    labels: [],
    datasets: [{ data: tempHistory.length > 1 ? tempHistory : [0, 0] }],
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Sensores' }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>LEITURAS ATUAIS</Text>
        <View style={styles.row}>
          <MetricCard label="Temperatura" value={sensors.temperature} unit="°C" />
          <MetricCard label="Pressão" value={sensors.pressure} unit="kPa" />
          <MetricCard label="Radiação" value={sensors.radiation} unit="mSv" />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>TEMPERATURA — HISTÓRICO</Text>
        <LineChart
          data={chartData}
          width={WIDTH}
          height={200}
          withDots={false}
          withInnerLines={false}
          chartConfig={{
            backgroundColor: colors.cardBackground,
            backgroundGradientFrom: colors.cardBackground,
            backgroundGradientTo: colors.cardBackground,
            color: () => colors.accent,
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
