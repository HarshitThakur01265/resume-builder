import { useState } from 'react'
import { askGemini } from '../services/gemini'
import ReactMarkdown from 'react-markdown'

export default function ChatbotPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const send = async () => {
    const content = input.trim()
    if (!content) return
    setInput('')
    setIsLoading(true)
    setMessages((m) => [...m, { role: 'user', content }])

    try {
      const text = await askGemini(content)
      setMessages((m) => [...m, { role: 'assistant', content: text || 'No response' }])
    } catch (e) {
      const message = (e && e.message) ? e.message : 'Unknown error'
      // Log details for debugging
      // eslint-disable-next-line no-console
      console.error('AI error:', e)
      setMessages((m) => [...m, { role: 'assistant', content: `Error contacting AI: ${message}` }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="page-glass-wrapper">
      <div className="glass-container glass-border" style={{ maxWidth: 800, padding: '40px', zIndex: 2, minHeight: '700px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: 'clamp(28px, 4vw, 36px)', 
            fontWeight: 700,
            background: 'linear-gradient(135deg, var(--text), var(--accent), #4f9ff5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            textShadow: '0 2px 4px rgba(96, 165, 250, 0.2)'
          }}>
            AI Resume Assistant
          </h2>
          <p style={{ color: 'var(--muted)', marginTop: '8px', fontSize: '16px' }}>
            Get personalized help from AI to improve your resume
          </p>
        </div>

        <div style={{ display: 'grid', gap: '20px', height: '600px' }}>
          {/* Chat Messages Area */}
          <div className="glass-container" style={{ 
            padding: '24px', 
            minHeight: '400px',
            background: 'rgba(255, 255, 255, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {messages.length === 0 ? (
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center',
                color: 'var(--muted)',
                fontSize: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🤖</div>
                  <div>Start a conversation with AI</div>
                  <div style={{ fontSize: '14px', marginTop: '8px', opacity: 0.7 }}>
                    Ask about resume optimization, formatting, or content suggestions
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ 
                flex: 1, 
                overflowY: 'auto', 
                paddingRight: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}>
                {messages.map((m, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: 600,
                      color: m.role === 'user' ? 'var(--accent)' : 'var(--text)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {m.role === 'user' ? (
                        <>
                          <span>👤</span>
                          You
                        </>
                      ) : (
                        <>
                          <span>🤖</span>
                          AI Assistant
                        </>
                      )}
                    </div>
                    <div className="glass-container" style={{
                      padding: '16px',
                      background: m.role === 'user' 
                        ? 'rgba(96, 165, 250, 0.1)' 
                        : 'rgba(255, 255, 255, 0.03)',
                      border: m.role === 'user' 
                        ? '1px solid rgba(96, 165, 250, 0.2)' 
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      fontSize: '15px',
                      lineHeight: '1.5'
                    }}>
                      {m.role === 'assistant' ? (
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      ) : (
                        <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    padding: '16px',
                    background: 'rgba(96, 165, 250, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(96, 165, 250, 0.1)'
                  }}>
                    <div style={{ 
                      width: '20px', 
                      height: '20px',
                      border: '2px solid rgba(96, 165, 250, 0.3)',
                      borderTop: '2px solid var(--accent)',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    <span style={{ color: 'var(--accent)', fontSize: '14px' }}>
                      AI is thinking...
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            <input 
              className="glass-input"
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask for resume help..." 
              style={{ flex: 1 }}
              disabled={isLoading}
            />
            <button 
              className="glass-button" 
              onClick={send}
              disabled={isLoading || !input.trim()}
              style={{ minWidth: '100px' }}
            >
              {isLoading ? (
                <div style={{ 
                  width: '20px', 
                  height: '20px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              ) : (
                '📤 Send'
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}