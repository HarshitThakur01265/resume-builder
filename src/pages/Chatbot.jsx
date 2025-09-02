import { useState } from 'react'
import { askGemini } from '../services/gemini'
import ReactMarkdown from 'react-markdown'

export default function ChatbotPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const send = async () => {
    const content = input.trim()
    if (!content) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', content }])

    try {
      const text = await askGemini(content)
      setMessages((m) => [...m, { role: 'assistant', content: text || 'No response' }])
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Error contacting AI.' }])
    }
  }

  return (
    <div>
      <h2>AI Chatbot</h2>
      <div style={{ display: 'grid', gap: 8 }}>
        <div style={{ background: '#111729', padding: 12, borderRadius: 8, minHeight: 160 }}>
          {messages.map((m, idx) => (
            <div key={idx} style={{ marginBottom: 8 }}>
              <strong>{m.role === 'user' ? 'You' : 'AI'}:</strong>
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {m.role === 'assistant' ? (
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask for resume help..." style={{ flex: 1 }} />
          <button onClick={send}>Send</button>
        </div>
      </div>
    </div>
  )
}

