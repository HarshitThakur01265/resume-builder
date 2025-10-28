import { useState } from 'react'
import { supabase, supabaseConfigError } from '../lib/supabaseClient'
import LottieAnimation from '../components/LottieAnimation'
import loadingAnimation from '../assets/animations/loading.json'
import successAnimation from '../assets/animations/success.json'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [loadingType, setLoadingType] = useState('')

  const signUp = async () => {
    setMessage('')
    if (!email || !password) return setMessage('Email and password required')
    if (!supabase) return setMessage(supabaseConfigError || 'Supabase client not initialized')
    if (password.length < 6) return setMessage('Password must be at least 6 characters')
    try {
      setIsLoading(true)
      setLoadingType('signup')
      setIsSuccess(false)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin }
      })
      if (error) {
        setMessage(error?.message || 'Signup failed')
      } else {
        setMessage(data?.user?.email ? `Verification sent to ${data.user.email}` : 'Check your email for verification link')
        setIsSuccess(true)
        setTimeout(() => setIsSuccess(false), 3000)
      }
    } finally {
      setIsLoading(false)
      setLoadingType('')
    }
  }
  
  const signIn = async () => {
    setMessage('')
    if (!email || !password) return setMessage('Email and password required')
    if (!supabase) return setMessage(supabaseConfigError || 'Supabase client not initialized')
    try {
      setIsLoading(true)
      setLoadingType('signin')
      setIsSuccess(false)
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage(error?.message || 'Sign in failed')
      } else {
        setMessage('Signed in')
        setIsSuccess(true)
        setTimeout(() => setIsSuccess(false), 3000)
      }
    } finally {
      setIsLoading(false)
      setLoadingType('')
    }
  }
  
  const signOut = async () => {
    try {
      setIsLoading(true)
      setLoadingType('signout')
      if (supabase) {
        await supabase.auth.signOut()
      }
      setMessage('Signed out')
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
    } finally {
      setIsLoading(false)
      setLoadingType('')
    }
  }

  

  return (
    <div className="page-glass-wrapper">
      <div className="glass-container glass-border" style={{ maxWidth: 460, padding: '40px', zIndex: 2, animation: 'fadeInUp 700ms ease both' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 className="auth-title-shimmer" style={{ 
            fontSize: 'clamp(28px, 4vw, 36px)', 
            fontWeight: 700,
            margin: 0
          }}>
            Auth
          </h2>
          <p style={{ color: 'var(--muted)', marginTop: '8px', fontSize: '16px' }}>
            Sign in to access your resume builder
          </p>
        </div>
        
        <div className="form-grid" style={{ gap: '20px' }}>
          <label style={{ gap: '8px' }}>
            <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Email Address</span>
            <input 
              className="glass-input"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email" 
              style={{ width: '100%' }}
            />
          </label>
          <label style={{ gap: '8px' }}>
            <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Password</span>
            <input 
              className="glass-input"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter your password"
              style={{ width: '100%' }}
            />
          </label>
          
          <div className="row" style={{ gap: '12px', marginTop: '8px' }}>
            <button className="glass-button" onClick={signUp} disabled={isLoading} title="Create account">
              {isLoading && loadingType === 'signup' ? (
                <LottieAnimation
                  animationData={loadingAnimation}
                  width={20}
                  height={20}
                  className="loading-animation"
                  loop={true}
                  autoplay={true}
                />
              ) : isSuccess && loadingType === 'signup' ? (
                <LottieAnimation
                  animationData={successAnimation}
                  width={20}
                  height={20}
                  className="success-animation"
                  loop={false}
                  autoplay={true}
                />
              ) : (
                'Sign Up'
              )}
            </button>
            <button className="glass-button" onClick={signIn} disabled={isLoading} title="Sign in to your account">
              {isLoading && loadingType === 'signin' ? (
                <LottieAnimation
                  animationData={loadingAnimation}
                  width={20}
                  height={20}
                  className="loading-animation"
                  loop={true}
                  autoplay={true}
                />
              ) : isSuccess && loadingType === 'signin' ? (
                <LottieAnimation
                  animationData={successAnimation}
                  width={20}
                  height={20}
                  className="success-animation"
                  loop={false}
                  autoplay={true}
                />
              ) : (
                'Sign In'
              )}
            </button>
            <button className="glass-button" onClick={signOut} disabled={isLoading} title="Sign out">
              {isLoading && loadingType === 'signout' ? (
                <LottieAnimation
                  animationData={loadingAnimation}
                  width={20}
                  height={20}
                  className="loading-animation"
                  loop={true}
                  autoplay={true}
                />
              ) : isSuccess && loadingType === 'signout' ? (
                <LottieAnimation
                  animationData={successAnimation}
                  width={20}
                  height={20}
                  className="success-animation"
                  loop={false}
                  autoplay={true}
                />
              ) : (
                'Sign Out'
              )}
            </button>
          </div>
          
          {message && (
            <div style={{
              marginTop: '20px',
              padding: '12px 16px',
              background: isSuccess 
                ? 'rgba(34, 197, 94, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${isSuccess 
                ? 'rgba(34, 197, 94, 0.3)' 
                : 'rgba(239, 68, 68, 0.3)'}`,
              borderRadius: '12px',
              color: isSuccess 
                ? 'rgba(34, 197, 94, 0.9)' 
                : 'rgba(239, 68, 68, 0.9)',
              fontSize: '14px',
              fontWeight: 500,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}