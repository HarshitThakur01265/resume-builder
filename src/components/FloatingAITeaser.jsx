import { useState, useEffect, useRef } from 'react'
import { askGemini, sanitizeAiText } from '../services/gemini'
import ReactMarkdown from 'react-markdown'

export default function FloatingAITeaser({ corner = 'bottom-right' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPulsing, setIsPulsing] = useState(false)
  const [showHoverMessage, setShowHoverMessage] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeFieldContext, setActiveFieldContext] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Detect text field focus for proactive pulsing
  useEffect(() => {
    const handleFocus = (e) => {
      const target = e.target
      if (
        (target.tagName === 'INPUT' && target.type !== 'submit' && target.type !== 'button' && target.type !== 'checkbox' && target.type !== 'radio') ||
        target.tagName === 'TEXTAREA'
      ) {
        setIsPulsing(true)
        // Get context from the field
        const label = target.closest('label')?.querySelector('span')?.textContent || 
                      target.getAttribute('placeholder') || 
                      target.getAttribute('name') || 
                      'this field'
        setActiveFieldContext(label)
        // Stop pulsing after 3 seconds
        setTimeout(() => setIsPulsing(false), 3000)
      }
    }

    const handleBlur = () => {
      setTimeout(() => setIsPulsing(false), 500)
    }

    document.addEventListener('focusin', handleFocus)
    document.addEventListener('focusout', handleBlur)

    return () => {
      document.removeEventListener('focusin', handleFocus)
      document.removeEventListener('focusout', handleBlur)
    }
  }, [])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const posStyle = (() => {
    const base = { position: 'fixed', zIndex: 1000 }
    if (corner === 'bottom-right') return { ...base, right: 24, bottom: 24 }
    if (corner === 'bottom-left') return { ...base, left: 24, bottom: 24 }
    if (corner === 'top-right') return { ...base, right: 24, top: 24 }
    return { ...base, left: 24, top: 24 }
  })()

  const handleSend = async (content = null) => {
    const messageContent = content || input.trim()
    if (!messageContent) return

    const newMessage = { role: 'user', content: messageContent }
    setMessages((prev) => [...prev, newMessage])
    if (!content) setInput('')
    setIsLoading(true)

    try {
      const response = await askGemini(messageContent)
      const safe = sanitizeAiText(response || 'No response', 4000)
      setMessages((prev) => [...prev, { role: 'assistant', content: safe }])
    } catch (e) {
      const message = e?.message || 'Unknown error'
      console.error('AI error:', e)
      setMessages((prev) => [...prev, { role: 'assistant', content: `Error contacting AI: ${message}` }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action) => {
    let prompt = ''
    switch (action) {
      case 'rephrase':
        prompt = activeFieldContext 
          ? `Help me rephrase the content in "${activeFieldContext}" to make it more professional and impactful.`
          : 'Help me rephrase these bullet points to make them more professional and impactful.'
        break
      case 'check':
        prompt = 'Check my resume for common errors, typos, formatting issues, and areas that need improvement.'
        break
      case 'keywords':
        prompt = "Suggest relevant keywords for a 'Frontend Developer' role that I should include in my resume."
        break
      default:
        prompt = action
    }
    handleSend(prompt)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickActions = [
    { id: 'rephrase', label: 'Rephrase these bullet points', icon: '✏️' },
    { id: 'check', label: 'Check my resume for common errors', icon: '✓' },
    { id: 'keywords', label: "Suggest keywords for a 'Frontend Developer' role", icon: '🔑' }
  ]

  return (
    <>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3),
                        0 0 0 0 rgba(59, 130, 246, 0.7);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 12px 48px rgba(59, 130, 246, 0.5),
                        0 0 0 8px rgba(59, 130, 246, 0);
            transform: scale(1.05);
          }
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .fab-button {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .fab-button:hover {
          transform: scale(1.05);
        }
        .hover-message {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>

      {/* Floating Action Button */}
      <div style={posStyle}>
        {!isOpen && (
          <div
            onMouseEnter={() => setShowHoverMessage(true)}
            onMouseLeave={() => setShowHoverMessage(false)}
            style={{ position: 'relative' }}
          >
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Open AI Assistant"
              className="fab-button"
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#2563eb',
                border: 'none',
                color: 'white',
                fontSize: 24,
                cursor: 'pointer',
                boxShadow: isPulsing
                  ? '0 4px 20px rgba(37, 99, 235, 0.4)'
                  : '0 4px 12px rgba(0, 0, 0, 0.25)',
                animation: isPulsing ? 'pulse-glow 2s ease-in-out infinite' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                zIndex: 1001
              }}
            >
              🤖
            </button>

            {/* Hover Message */}
            {showHoverMessage && (
              <div
                className="hover-message"
                style={{
                  position: 'absolute',
                  right: 80,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'var(--panel)',
                  color: 'var(--text)',
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  whiteSpace: 'nowrap',
                  fontSize: 14,
                  fontWeight: 500,
                  pointerEvents: 'none',
                  zIndex: 1002
                }}
              >
                {activeFieldContext ? 'Need help writing this?' : 'AI suggestions available'}
                <div
                  style={{
                    position: 'absolute',
                    right: -6,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 0,
                    height: 0,
                    borderTop: '6px solid transparent',
                    borderBottom: '6px solid transparent',
                    borderLeft: '6px solid var(--panel)'
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Slide-in Chat Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: isOpen ? 0 : '-420px',
          width: '400px',
          maxWidth: '90vw',
          height: '100vh',
          background: 'var(--panel)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: isOpen ? '-8px 0 32px rgba(0, 0, 0, 0.3)' : 'none',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: isOpen ? 'slide-in-right 0.3s ease-out' : 'none'
        }}
      >
        {/* Chat Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))'
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
                             fontSize: 20
             }}
           >
             🤖
           </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>AI Assistant</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Resume helper</div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text)',
              fontSize: 24,
              cursor: 'pointer',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            ×
          </button>
        </div>

        {/* Quick Actions */}
        {messages.length === 0 && (
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, fontWeight: 600 }}>
              Quick Actions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.id)}
                  disabled={isLoading}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 8,
                    padding: '12px 16px',
                    color: 'var(--text)',
                    fontSize: 13,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.2s',
                    opacity: isLoading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.background = 'rgba(59, 130, 246, 0.15)'
                      e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)'
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}
        >
          {messages.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'var(--muted)',
                fontSize: 14,
                padding: '40px 20px'
              }}
            >
              <div>
                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>🤖</div>
                <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>
                  Start a conversation
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                  Ask me anything about your resume
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    animation: 'fade-in 0.3s ease-out'
                  }}
                >
                  <div
                    style={{
                      background:
                        msg.role === 'user'
                          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.3))'
                          : 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 16,
                      padding: '12px 16px',
                      color: 'var(--text)',
                      fontSize: 14,
                      lineHeight: 1.6
                    }}
                  >
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p style={{ margin: '0 0 8px 0' }}>{children}</p>,
                          ul: ({ children }) => <ul style={{ margin: '8px 0', paddingLeft: 20 }}>{children}</ul>,
                          ol: ({ children }) => <ol style={{ margin: '8px 0', paddingLeft: 20 }}>{children}</ol>,
                          li: ({ children }) => <li style={{ margin: '4px 0' }}>{children}</li>,
                          strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div
                  style={{
                    alignSelf: 'flex-start',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 16,
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center'
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      borderTop: '2px solid var(--text)',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}
                  />
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(0, 0, 0, 0.2)'
          }}
        >
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask for resume help..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 12,
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text)',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              style={{
                padding: '12px 20px',
                borderRadius: 12,
                border: 'none',
                background: isLoading || !input.trim()
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: 'white',
                fontSize: 14,
                fontWeight: 600,
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: isLoading || !input.trim() ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading && input.trim()) {
                  e.target.style.transform = 'scale(1.05)'
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)'
              }}
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop when open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 998,
            animation: 'fade-in 0.2s ease-out'
          }}
        />
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}



