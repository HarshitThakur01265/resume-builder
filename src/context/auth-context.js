import { createContext, useContext } from 'react'

const defaultValue = {
  user: null,
  session: null,
  loading: false,
  error: null,
  refreshUser: async () => null,
  signOut: async () => undefined
}

export const AuthContext = createContext(defaultValue)

export function useAuth() {
  return useContext(AuthContext)
}
