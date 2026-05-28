import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Alert } from '@/types/mission'
import { useTheme } from '@/contexts/ThemeContext'

interface Props {
  alert: Alert
}

export function AlertItem({ alert }: Props) {
  const { colors } = useTheme()
  const color =
    alert.severity === 'critical'
      ? colors.critical
      : alert.severity === 'warning'
      ? colors.warning
      : colors.accent
  const icon =
    alert.severity === 'critical'
      ? 'alert-circle'
      : alert.severity === 'warning'
      ? 'warning'
      : 'information-circle'

  const time = alert.timestamp.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground, borderLeftColor: color }]}>
      <Ionicons name={icon} size={22} color={color} style={styles.icon} />
      <View style={styles.content}>
        <Text style={[styles.message, { color: colors.text }]}>{alert.message}</Text>
        <Text style={[styles.time, { color: colors.textSecondary }]}>{time}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderLeftWidth: 4,
    padding: 12,
    marginVertical: 4,
  },
  icon: { marginRight: 10 },
  content: { flex: 1 },
  message: { fontSize: 14, fontWeight: '500' },
  time: { fontSize: 11, marginTop: 2 },
})
