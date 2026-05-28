import { Stack } from 'expo-router'
import { useTheme } from '@/contexts/ThemeContext'

export default function DashboardsLayout() {
  const { colors } = useTheme()
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.accent,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    />
  )
}
