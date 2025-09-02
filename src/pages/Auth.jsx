import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const signUp = async () => {
    setMessage('')
    if (!email || !password) return setMessage('Email and password required')
    if (password.length < 6) return setMessage('Password must be at least 6 characters')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin }
    })
    if (error) {
      setMessage(error?.message || 'Signup failed')
    } else {
      setMessage(data?.user?.email ? `Verification sent to ${data.user.email}` : 'Check your email for verification link')
    }
  }
  const signIn = async () => {
    setMessage('')
    if (!email || !password) return setMessage('Email and password required')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error?.message || 'Sign in failed')
    else setMessage('Signed in')
  }
  const signOut = async () => {
    await supabase.auth.signOut()
    setMessage('Signed out')
  }

  return (
    <div>
      <h2>Auth</h2>
      <div style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={signUp}>Sign Up</button>
          <button onClick={signIn}>Sign In</button>
          <button onClick={signOut}>Sign Out</button>
        </div>
        {message && <p>{message}</p>}
      </div>
    </div>
  )
}

