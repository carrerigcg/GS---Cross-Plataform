import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'
import { MetricStatus } from '@/types/mission'

interface Props {
  label: string
  value: string | number
  unit: string
  status?: MetricStatus
}

export function MetricCard({ label, value, unit, status = 'ok' }: Props) {
  const { colors } = useTheme()
  const statusColor =
    status === 'critical'
      ? colors.critical
      : status === 'warning'
      ? colors.warning
      : colors.ok

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: statusColor }]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.value, { color: statusColor }]}>
        {typeof value === 'number' ? value.toFixed(1) : value}
      </Text>
      <Text style={[styles.unit, { color: colors.textSecondary }]}>{unit}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
    margin: 6,
  },
  label: { fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { fontSize: 24, fontWeight: 'bold' },
  unit: { fontSize: 11, marginTop: 2 },
})
