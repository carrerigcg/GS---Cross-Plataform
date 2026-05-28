import React, { useEffect, useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useMission } from '@/contexts/MissionContext'
import { useTheme } from '@/contexts/ThemeContext'
import { ThresholdFormErrors, ThresholdFormValues } from '@/types/mission'

export function validateThresholds(values: ThresholdFormValues): ThresholdFormErrors {
  const errors: ThresholdFormErrors = {}
  const num = (v: string) => parseFloat(v)

  if (!values.maxTemperature || isNaN(num(values.maxTemperature)))
    errors.maxTemperature = 'Informe um número válido'
  else if (num(values.maxTemperature) <= 0)
    errors.maxTemperature = 'Deve ser maior que 0'

  if (!values.minPressure || isNaN(num(values.minPressure)))
    errors.minPressure = 'Informe um número válido'
  else if (num(values.minPressure) <= 0)
    errors.minPressure = 'Deve ser maior que 0'

  if (!values.minBattery || isNaN(num(values.minBattery)))
    errors.minBattery = 'Informe um número válido'
  else if (num(values.minBattery) < 0 || num(values.minBattery) > 100)
    errors.minBattery = 'Deve estar entre 0 e 100'

  if (!values.minSignal || isNaN(num(values.minSignal)))
    errors.minSignal = 'Informe um número válido'

  if (!values.maxLatency || isNaN(num(values.maxLatency)))
    errors.maxLatency = 'Informe um número válido'
  else if (num(values.maxLatency) < 0)
    errors.maxLatency = 'Deve ser maior ou igual a 0'

  return errors
}

export default function SettingsScreen() {
  const { thresholds, updateThresholds } = useMission()
  const { colors } = useTheme()

  const [form, setForm] = useState<ThresholdFormValues>({
    maxTemperature: String(thresholds.maxTemperature),
    minPressure: String(thresholds.minPressure),
    minBattery: String(thresholds.minBattery),
    minSignal: String(thresholds.minSignal),
    maxLatency: String(thresholds.maxLatency),
  })
  const [errors, setErrors] = useState<ThresholdFormErrors>({})

  useEffect(() => {
    setForm({
      maxTemperature: String(thresholds.maxTemperature),
      minPressure: String(thresholds.minPressure),
      minBattery: String(thresholds.minBattery),
      minSignal: String(thresholds.minSignal),
      maxLatency: String(thresholds.maxLatency),
    })
  }, [thresholds])

  const handleSave = () => {
    const errs = validateThresholds(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    updateThresholds({
      maxTemperature: parseFloat(form.maxTemperature),
      minPressure: parseFloat(form.minPressure),
      minBattery: parseFloat(form.minBattery),
      minSignal: parseFloat(form.minSignal),
      maxLatency: parseFloat(form.maxLatency),
    })
    Alert.alert('Salvo', 'Limiares atualizados com sucesso.')
  }

  const field = (
    key: keyof ThresholdFormValues,
    label: string,
    unit: string
  ) => (
    <View style={styles.fieldContainer} key={key}>
      <Text style={[styles.label, { color: colors.text }]}>
        {label} <Text style={{ color: colors.textSecondary }}>({unit})</Text>
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.cardBackground,
            borderColor: errors[key] ? colors.critical : colors.border,
            color: colors.text,
          },
        ]}
        value={form[key]}
        onChangeText={(v) => {
          setForm((prev) => ({ ...prev, [key]: v }))
          if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
        }}
        keyboardType="numeric"
        placeholderTextColor={colors.textSecondary}
      />
      {errors[key] && (
        <Text style={[styles.error, { color: colors.critical }]}>{errors[key]}</Text>
      )}
    </View>
  )

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.text }]}>Configurações</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Defina os limiares críticos da missão
        </Text>

        {field('maxTemperature', 'Temperatura máxima', '°C')}
        {field('minPressure', 'Pressão mínima', 'kPa')}
        {field('minBattery', 'Bateria mínima', '%')}
        {field('minSignal', 'Sinal mínimo', 'dBm')}
        {field('maxLatency', 'Latência máxima', 'ms')}

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: colors.accent }]}
          onPress={handleSave}
        >
          <Text style={styles.saveBtnText}>Salvar Configurações</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 13, marginBottom: 24 },
  fieldContainer: { marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16 },
  error: { fontSize: 12, marginTop: 4 },
  saveBtn: { borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 8 },
  saveBtnText: { color: '#000', fontWeight: '700', fontSize: 16 },
})
