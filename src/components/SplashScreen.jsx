import { useState, useEffect } from 'react'

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState('cursor') // cursor, brand, tagline, spinner, fade
  const [brandText, setBrandText] = useState('')
  const [taglineText, setTaglineText] = useState('')
  const [showCursor, setShowCursor] = useState(true)

  const brandName = 'Resumify'
  const tagline = 'Build a resume that gets you hired.'

  // Blinking cursor animation
  useEffect(() => {
    if (phase === 'cursor' || phase === 'brand' || phase === 'tagline') {
      const interval = setInterval(() => {
        setShowCursor((prev) => !prev)
      }, 530)
      return () => clearInterval(interval)
    }
  }, [phase])

  // Phase 1: Show cursor for 0.5s
  useEffect(() => {
    if (phase === 'cursor') {
      const timer = setTimeout(() => {
        setPhase('brand')
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [phase])

  // Phase 2: Type brand name letter by letter
  useEffect(() => {
    if (phase === 'brand') {
      let index = 0
      const typingInterval = setInterval(() => {
        if (index < brandName.length) {
          setBrandText(brandName.slice(0, index + 1))
          index++
        } else {
          clearInterval(typingInterval)
          // Wait a bit before showing tagline
          setTimeout(() => {
            setPhase('tagline')
          }, 200)
        }
      }, 80) // Typing speed - faster for brand name
      return () => clearInterval(typingInterval)
    }
  }, [phase])

  // Phase 3: Type tagline letter by letter
  useEffect(() => {
    if (phase === 'tagline') {
      let index = 0
      const typingInterval = setInterval(() => {
        if (index < tagline.length) {
          const currentChar = tagline[index]
          setTaglineText(tagline.slice(0, index + 1))
          index++
          // When period is typed, immediately move to spinner phase
          if (currentChar === '.') {
            clearInterval(typingInterval)
            setTimeout(() => {
              setPhase('spinner')
              setShowCursor(false)
            }, 100) // Brief delay to see the period transform
          }
        } else {
          clearInterval(typingInterval)
        }
      }, 30) // Faster typing for tagline
      return () => clearInterval(typingInterval)
    }
  }, [phase])

  // Phase 4: Show spinner for 1.5 seconds, then fade
  useEffect(() => {
    if (phase === 'spinner') {
      const timer = setTimeout(() => {
        setPhase('fade')
      }, 1200) // Spinner duration - slightly shorter
      return () => clearTimeout(timer)
    }
  }, [phase])

  // Phase 5: Fade to white and complete
  useEffect(() => {
    if (phase === 'fade') {
      const timer = setTimeout(() => {
        onComplete()
      }, 400) // Fade duration - faster transition
      return () => clearTimeout(timer)
    }
  }, [phase, onComplete])

  const isFading = phase === 'fade'
  const isSpinner = phase === 'spinner'

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: isFading ? '#ffffff' : '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        transition: isFading ? 'background 0.4s ease' : 'none',
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
      }}
    >
      <style>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .typing-cursor {
          animation: blink 1s infinite;
        }
        .spinner {
          animation: spin 0.8s linear infinite;
        }
      `}</style>

      <div
        style={{
          textAlign: 'center',
          color: isFading ? '#000000' : '#ffffff',
          transition: 'color 0.4s ease',
          opacity: isFading ? 0 : 1,
          transitionProperty: isFading ? 'opacity' : 'none',
          transitionDuration: '0.4s'
        }}
      >
        {/* Brand Name */}
        <div
          style={{
            fontSize: 'clamp(32px, 8vw, 72px)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            marginBottom: phase === 'tagline' || phase === 'spinner' || phase === 'fade' ? '16px' : '0',
            minHeight: phase === 'tagline' || phase === 'spinner' || phase === 'fade' ? 'auto' : '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>{brandText}</span>
          {(phase === 'cursor' || phase === 'brand') && showCursor && (
            <span className="typing-cursor" style={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
              |
            </span>
          )}
        </div>

        {/* Tagline */}
        {(phase === 'tagline' || phase === 'spinner' || phase === 'fade') && (
          <div
            style={{
              fontSize: 'clamp(18px, 4vw, 32px)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              opacity: taglineText.length > 0 ? 1 : 0,
              transition: 'opacity 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap'
            }}
          >
            <span>
              {isSpinner ? taglineText.slice(0, -1) : taglineText}
            </span>
            {isSpinner ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div
                  className="spinner"
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid #ffffff',
                    borderRadius: '50%'
                  }}
                />
              </span>
            ) : (
              phase === 'tagline' &&
              taglineText.length > 0 &&
              showCursor && (
                <span className="typing-cursor" style={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
                  |
                </span>
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
}
