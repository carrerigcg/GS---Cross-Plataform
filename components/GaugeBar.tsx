import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'

interface Props {
  label: string
  value: number
  max?: number
  unit?: string
}

export function GaugeBar({ label, value, max = 100, unit = '%' }: Props) {
  const { colors } = useTheme()
  const pct = Math.min(1, Math.max(0, value / max))
  const barColor =
    pct < 0.2 ? colors.critical : pct < 0.4 ? colors.warning : colors.ok

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.value, { color: barColor }]}>
          {value.toFixed(1)}{unit}
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: barColor }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { fontSize: 13 },
  value: { fontSize: 13, fontWeight: '600' },
  track: { height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4 },
})
