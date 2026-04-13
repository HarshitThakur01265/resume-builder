import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import { ThemeProvider } from './theme.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import { getSupabaseStartupWarnings } from './lib/supabaseClient.js'

const startupWarnings = getSupabaseStartupWarnings()
if (startupWarnings.length > 0) {
  console.warn('[Startup check] Review environment configuration:')
  startupWarnings.forEach((warning) => console.warn(`- ${warning}`))
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary>
            <ScrollToTop />
            <App />
          </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
