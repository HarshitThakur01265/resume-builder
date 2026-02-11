import { useState } from 'react'
import { askGemini, sanitizeAiText } from '../services/gemini'
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
      const safe = sanitizeAiText(text || 'No response', 4000)
      setMessages((m) => [...m, { role: 'assistant', content: safe }])
    } catch (e) {
      const message = (e && e.message) ? e.message : 'Unknown error'
      // Log details for debugging
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
    <div style={{ padding: '24px 16px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>AI Resume Assistant</h2>
          <p style={{ color: 'var(--muted)', marginTop: '6px', fontSize: '14px' }}>Get help from AI to improve your resume</p>
        </div>

        <div style={{ display: 'grid', gap: '12px', height: '600px' }}>
          {/* Chat Messages Area */}
          <div style={{ 
            padding: '16px', 
            minHeight: '400px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '8px',
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
                paddingRight: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                overflowWrap: 'anywhere',
                wordBreak: 'break-word'
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
                    <div style={{
                      padding: '12px',
                      background: m.role === 'user' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '8px',
                      fontSize: '15px',
                      lineHeight: '1.5',
                      maxWidth: '100%',
                      overflowX: 'auto',
                      overflowWrap: 'anywhere',
                      wordBreak: 'break-word'
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
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <input 
              
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask for resume help..." 
              style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'var(--text)' }}
              disabled={isLoading}
            />
            <button 
              onClick={send}
              disabled={isLoading || !input.trim()}
              style={{ minWidth: '90px' }}
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