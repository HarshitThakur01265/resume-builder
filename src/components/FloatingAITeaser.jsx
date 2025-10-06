import { useState } from 'react'
import AITeaser from './AITeaser'

export default function FloatingAITeaser({ corner = 'bottom-right', imageUrl = '' }) {
  const [open, setOpen] = useState(false)
  const [imgOk, setImgOk] = useState(true)
  const posStyle = (() => {
    const base = { position: 'fixed', zIndex: 1000 }
    if (corner === 'bottom-right') return { ...base, right: 16, bottom: 16 }
    if (corner === 'bottom-left') return { ...base, left: 16, bottom: 16 }
    if (corner === 'top-right') return { ...base, right: 16, top: 16 }
    return { ...base, left: 16, top: 16 }
  })()

  return (
    <div style={posStyle}>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open AI Assistant teaser"
          style={{
            background: 'var(--panel)',
            color: 'var(--text)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 999,
            padding: '8px 10px',
            boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          {imageUrl && imgOk ? (
            <img
              src={imageUrl}
              alt="AI"
              width={22}
              height={22}
              style={{ borderRadius: 999, objectFit: 'cover' }}
              onError={() => setImgOk(false)}
            />
          ) : (
            <span style={{ fontSize: 16 }}>🤖</span>
          )}
          <span>Ask AI</span>
        </button>
      )}
      {open && (
        <div style={{
          width: 360,
          maxWidth: '92vw',
          background: 'var(--panel)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 16,
          boxShadow: '0 20px 40px rgba(0,0,0,0.35)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '8px 10px', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {imageUrl && imgOk ? (
              <img
                src={imageUrl}
                alt="AI"
                width={22}
                height={22}
                style={{ borderRadius: 999, objectFit: 'cover' }}
                onError={() => setImgOk(false)}
              />
            ) : (
              <div style={{ width: 22, height: 22, borderRadius: 999, background: 'linear-gradient(135deg,#22d3ee,#3b82f6)' }} />
            )}
            <div style={{ fontWeight: 700, flex: 1 }}>AI Assistant</div>
            <button onClick={() => setOpen(false)} aria-label="Close" style={{ background: 'transparent', color: 'var(--text)', border: 'none', cursor: 'pointer', fontSize: 18 }}>×</button>
          </div>
          <div style={{ padding: 10 }}>
            <AITeaser />
          </div>
        </div>
      )}
    </div>
  )
}



