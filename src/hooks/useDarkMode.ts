import { useCallback, useEffect, useState } from 'react'
import { getStoredTheme, saveTheme } from '../store/useNotesStore'

export type Theme = 'light' | 'dark'

export function applyThemeClass(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme())

  useEffect(() => {
    applyThemeClass(theme)
    saveTheme(theme)
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggle }
}