import React from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useMission } from '@/contexts/MissionContext'
import { useTheme } from '@/contexts/ThemeContext'
import { AlertItem } from '@/components/AlertItem'

export default function AlertsScreen() {
  const { alerts, clearAlerts } = useMission()
  const { colors } = useTheme()

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Alertas</Text>
        {alerts.length > 0 && (
          <TouchableOpacity
            style={[styles.clearBtn, { borderColor: colors.critical }]}
            onPress={clearAlerts}
          >
            <Text style={[styles.clearText, { color: colors.critical }]}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      {alerts.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Nenhum alerta ativo.{'\n'}Todos os sistemas operando normalmente.
          </Text>
        </View>
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AlertItem alert={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
  clearBtn: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  clearText: { fontSize: 13, fontWeight: '600' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { textAlign: 'center', fontSize: 15, lineHeight: 24 },
  list: { padding: 16 },
})
