import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthProvider'
import TypingEffect from './TypingEffect'

export default function HomeTypingEffect() {
  const { user } = useAuth()
  const [currentSection, setCurrentSection] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [showStamp, setShowStamp] = useState(false)

  const derivedName = (() => {
    const metaName = user?.user_metadata?.full_name || user?.user_metadata?.name
    if (metaName && typeof metaName === 'string') return metaName
    const local = user?.email?.split?.('@')?.[0]
    if (local && typeof local === 'string') {
      const cleaned = local.replace(/[_\-.]+/g, ' ').trim()
      const letters = (cleaned.match(/[A-Za-z]/g) || []).length
      const digits = (cleaned.match(/\d/g) || []).length
      const hasLongDigitRun = /\d{3,}/.test(cleaned)
      const isMostlyDigits = digits > letters
      if (!hasLongDigitRun && !isMostlyDigits && letters >= 2) {
        return cleaned
          .split(' ')
          .filter(Boolean)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ')
      }
    }
    return 'Sarah Johnson'
  })()

  const sampleResume = [
    {
      title: "Name",
      content: derivedName,
      delay: 1000,
      icon: "👤"
    },
    {
      title: "Title", 
      content: "Senior Software Engineer",
      delay: 2000,
      icon: "💼"
    },
    {
      title: "Experience",
      content: "5+ years building scalable web applications",
      delay: 3000,
      icon: "🚀"
    },
    {
      title: "Skills",
      content: "React • Node.js • Python • AWS",
      delay: 4000,
      icon: "⚡"
    }
  ]

  useEffect(() => {
    if (currentSection >= sampleResume.length) {
      setShowStamp(true)
      const restart = setTimeout(() => {
        setShowStamp(false)
        setCurrentSection(0)
        setIsTyping(true)
      }, 2500)
      return () => clearTimeout(restart)
    }

    const timer = setTimeout(() => {
      setCurrentSection(prev => prev + 1)
    }, sampleResume[currentSection]?.delay || 2000)

    return () => clearTimeout(timer)
  }, [currentSection])

  return (
    <div style={{ 
      position: 'relative', 
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
      borderRadius: '20px', 
      padding: '40px', 
      margin: '20px auto',
      maxWidth: '600px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      animation: 'fadeInUp 1s ease-out'
    }}>
      {/* Animated Background Glow */}
      <div style={{
        position: 'absolute',
        top: '-2px',
        left: '-2px',
        right: '-2px',
        bottom: '-2px',
        background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981)',
        borderRadius: '22px',
        zIndex: -1,
        opacity: 0.3,
        animation: 'rotate 3s linear infinite'
      }} />

      {/* Hero animation replaced with paper typing and stamp */}

      {/* Paper-style surface */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.03)',
        position: 'relative'
      }}>
        {/* Typing Content with Enhanced Styling */}
        <div style={{ 
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', 
          color: '#0f172a',
          position: 'relative'
        }}>
        {sampleResume.slice(0, currentSection + 1).map((section, index) => (
          <div 
            key={index} 
            style={{ 
              marginBottom: '25px',
              opacity: index <= currentSection ? 1 : 0.3,
              transform: index === currentSection ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 0.3s ease-in-out',
              animation: index === currentSection ? 'pulse 2s ease-in-out infinite' : 'none'
            }}
          >
            {/* Section Header with Icon */}
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px'
            }}>
              <div style={{
                fontSize: '20px',
                animation: 'bounce 1s ease-in-out infinite'
              }}>
                {section.icon}
              </div>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '700', 
                color: index === currentSection ? '#2563eb' : '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                textShadow: 'none'
              }}>
                {section.title}
              </div>
            </div>
            
            {/* Typing Content */}
            <div style={{ 
              fontSize: '18px', 
              minHeight: '25px',
              fontWeight: '500',
              lineHeight: '1.4'
            }}>
              {index === currentSection ? (
                <div style={{
                  background: 'linear-gradient(90deg, #111827, #2563eb, #111827)',
                  backgroundSize: '200% 100%',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'shimmer 2s ease-in-out infinite'
                }}>
                  <TypingEffect
                    strings={[section.content]}
                    typeSpeed={50}
                    backSpeed={30}
                    loop={false}
                    showCursor={true}
                  />
                </div>
              ) : (
                <span style={{ 
                  color: '#1f2937'
                }}>
                  {section.content}
                </span>
              )}
            </div>
          </div>
        ))}
        </div>
        {/* Ready stamp */}
        {showStamp && (
          <div style={{
            position: 'absolute',
            right: '16px',
            bottom: '16px',
            transform: 'rotate(-8deg)',
            border: '3px solid #16a34a',
            color: '#16a34a',
            borderRadius: '8px',
            padding: '8px 12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            background: 'rgba(22,163,74,0.1)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
            animation: 'stampIn 600ms ease-out forwards'
          }}>
            ✅ Resume Ready
          </div>
        )}
      </div>

      {/* Enhanced Resume Icon */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        width: '32px',
        height: '32px',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        color: '#60a5fa',
        border: '1px solid rgba(96, 165, 250, 0.3)',
        animation: 'float 3s ease-in-out infinite'
      }}>
        📄
      </div>

      {/* Progress Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        gap: '4px'
      }}>
        {sampleResume.map((_, index) => (
          <div
            key={index}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: index <= currentSection ? '#60a5fa' : 'rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease',
              animation: index === currentSection ? 'pulse 1s ease-in-out infinite' : 'none'
            }}
          />
        ))}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
          60% { transform: translateY(-3px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        @keyframes stampIn {
          0% { opacity: 0; transform: scale(0.5) rotate(-20deg); }
          70% { opacity: 1; transform: scale(1.08) rotate(-6deg); }
          100% { opacity: 1; transform: scale(1) rotate(-8deg); }
        }
      `}</style>
    </div>
  )
}
