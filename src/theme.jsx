import { useHotkeys } from '@mantine/hooks'
import { MantineProvider, ColorSchemeScript } from '@mantine/core'
import { useEffect, useState } from 'react'

export function ThemeProvider({ children }) {
  const [colorScheme, setColorScheme] = useState('dark')
  useEffect(() => {
    const saved = localStorage.getItem('color-scheme')
    if (saved) setColorScheme(saved)
  }, [])
  const toggle = () => {
    const next = colorScheme === 'dark' ? 'light' : 'dark'
    setColorScheme(next)
    localStorage.setItem('color-scheme', next)
  }
  useHotkeys([["mod+J", toggle]])
  return (
    <>
      <ColorSchemeScript defaultColorScheme="dark" />
      <MantineProvider defaultColorScheme={colorScheme} theme={{ fontFamily: 'Inter, system-ui, Segoe UI, Roboto, Helvetica, Arial' }}>
        {children}
      </MantineProvider>
    </>
  )
}

