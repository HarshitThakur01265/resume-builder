import { useState, useEffect, useCallback, useMemo } from 'react'
import { AuthContext } from './auth-context'
import { supabase, supabaseConfigError } from '../lib/supabaseClient'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(Boolean(supabase))
  const [error, setError] = useState(null)

  const syncFromSession = useCallback((nextSession) => {
    setSession(nextSession)
    setUser(nextSession?.user ?? null)
  }, [])

  const refreshUser = useCallback(async () => {
    if (!supabase) {
      setError(supabaseConfigError || 'Supabase client not initialized')
      syncFromSession(null)
      setLoading(false)
      return null
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      syncFromSession(data?.session ?? null)
      setError(null)
      return data?.session?.user ?? null
    } catch (err) {
      console.error('AuthProvider refreshUser error:', err)
      setError(err?.message || 'Unable to fetch login info')
      syncFromSession(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [syncFromSession])

  useEffect(() => {
    let isMounted = true
    refreshUser()

    if (!supabase) {
      return () => {
        isMounted = false
      }
    }

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return
      syncFromSession(nextSession)
      setError(null)
      setLoading(false)
    })

    return () => {
      isMounted = false
      listener?.subscription?.unsubscribe?.()
    }
  }, [refreshUser, syncFromSession])

  const signOut = useCallback(async () => {
    if (!supabase) return
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('AuthProvider signOut error:', err)
      setError(err?.message || 'Unable to sign out')
    } finally {
      await refreshUser()
    }
  }, [refreshUser])

  const value = useMemo(() => ({
    user,
    session,
    loading,
    error,
    refreshUser,
    signOut
  }), [user, session, loading, error, refreshUser, signOut])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Consumers should import `useAuth` directly from './auth-context'

