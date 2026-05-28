import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/contexts/ThemeContext'

const DASHBOARDS = [
  { label: 'Sensores', route: '/dashboards/sensors', icon: 'thermometer', desc: 'Temperatura, Pressão, Radiação' },
  { label: 'Energia', route: '/dashboards/energy', icon: 'battery-charging', desc: 'Bateria, Solar, Consumo' },
  { label: 'Comunicação', route: '/dashboards/communication', icon: 'radio', desc: 'Sinal, Latência, Link' },
  { label: 'Orbital', route: '/dashboards/orbital', icon: 'globe', desc: 'Altitude, Velocidade, Inclinação' },
] as const

export default function DashboardsIndex() {
  const { colors } = useTheme()
  const router = useRouter()

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.text }]}>Dashboards</Text>
        <View style={styles.grid}>
          {DASHBOARDS.map((d) => (
            <TouchableOpacity
              key={d.route}
              style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              onPress={() => router.push(d.route as any)}
            >
              <Ionicons name={d.icon as any} size={32} color={colors.accent} />
              <Text style={[styles.label, { color: colors.text }]}>{d.label}</Text>
              <Text style={[styles.desc, { color: colors.textSecondary }]}>{d.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%', borderRadius: 12, borderWidth: 1, padding: 20,
    alignItems: 'center', marginBottom: 12, gap: 8,
  },
  label: { fontSize: 16, fontWeight: '600' },
  desc: { fontSize: 11, textAlign: 'center' },
})
