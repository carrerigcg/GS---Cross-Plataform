import { Stack } from 'expo-router'
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext'
import { MissionProvider } from '@/contexts/MissionContext'
import { StatusBar } from 'expo-status-bar'

function RootLayoutInner() {
  const { isDark } = useTheme()
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  )
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <MissionProvider>
        <RootLayoutInner />
      </MissionProvider>
    </ThemeProvider>
  )
}
