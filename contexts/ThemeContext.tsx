import React, { createContext, useContext, useEffect, useState } from 'react'
import { ThemeColors } from '@/types/mission'
import { darkColors, lightColors } from '@/constants/theme'
import { saveToStorage, loadFromStorage } from '@/hooks/useAsyncStorage'

const THEME_KEY = '@orbitsense:theme'

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
  colors: ThemeColors
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => {},
  colors: darkColors,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    loadFromStorage<boolean>(THEME_KEY).then((saved) => {
      if (saved !== null) setIsDark(saved)
    })
  }, [])

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev
      saveToStorage(THEME_KEY, next)
      return next
    })
  }

  return (
    <ThemeContext.Provider
      value={{ isDark, toggleTheme, colors: isDark ? darkColors : lightColors }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
