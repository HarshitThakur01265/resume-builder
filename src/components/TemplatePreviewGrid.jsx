import { useState, useRef, useEffect } from 'react'
import PreviewCanvas from './PreviewCanvas'

const demoResumes = [
  {
    id: 'professional',
    name: 'Professional',
    resume: {
      template: 'professional',
      content: {
        personal: { name: 'Alex Carter', email: 'alex@example.com' },
        experience: [
          { role: 'Frontend Developer', company: 'Acme Inc.', summary: 'Built React apps.' }
        ],
        education: [
          { degree: 'B.Sc. Computer Science', year: '2020' }
        ],
        skills: ['React', 'JavaScript', 'CSS']
      }
    }
  },
  {
    id: 'modern',
    name: 'Modern',
    resume: {
      template: 'modern',
      content: {
        personal: { name: 'Jamie Lee', email: 'jamie@example.com' },
        links: { github: 'https://github.com/jamie' },
        summary: 'Research-oriented engineer with publications.',
        experience: [
          { role: 'Research Assistant', company: 'Tech Lab', period: '2022–Present', points: ['Published 2 papers'] }
        ],
        education: [
          { degree: 'M.Sc. AI', institution: 'State University', year: '2023' }
        ],
        skills: ['Python', 'NLP', 'TensorFlow']
      }
    }
  }
]

export default function TemplatePreviewGrid({ onSelect }) {
  const [selected, setSelected] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [activeId, setActiveId] = useState(demoResumes[0]?.id)
  const rowRef = useRef(null)
  const indicatorRef = useRef(null)

  useEffect(() => {
    const row = rowRef.current
    const indicator = indicatorRef.current
    if (!row || !indicator || !activeId) return
    const btn = row.querySelector(`[data-id="${activeId}"]`)
    if (!btn) return
    const rowRect = row.getBoundingClientRect()
    const btnRect = btn.getBoundingClientRect()
    const left = btnRect.left - rowRect.left + row.scrollLeft
    indicator.style.width = `${btnRect.width - 24}px`
    indicator.style.transform = `translateX(${left + 12}px)`
  }, [activeId])

  const handleSelect = (item) => {
    setSelected(item)
    if (onSelect) onSelect(item)
  }

  return (
    <div>
      <div ref={rowRef} style={{
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        paddingBottom: '8px',
        WebkitOverflowScrolling: 'touch',
        position: 'relative'
      }}>
        {/* Sliding active indicator */}
        <div ref={indicatorRef} aria-hidden="true" style={{
          position: 'absolute',
          height: '3px',
          bottom: '4px',
          left: 0,
          width: 0,
          background: 'linear-gradient(90deg, var(--accent), rgba(96,165,250,0.8))',
          borderRadius: '999px',
          transition: 'transform 300ms ease, width 300ms ease',
          pointerEvents: 'none'
        }} />
        {demoResumes.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item)}
            aria-label={`Preview ${item.name} template`}
            data-id={item.id}
            style={{
              cursor: 'pointer',
              textAlign: 'left',
              border: '2px solid transparent',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(147, 51, 234, 0.08))',
              padding: '12px',
              transition: 'transform 200ms ease, box-shadow 200ms ease, background 200ms ease',
              boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
              position: 'relative',
              overflow: 'hidden',
              flex: '0 0 520px',
              maxWidth: '520px'
            }}
            onMouseEnter={(e) => {
              setHoveredId(item.id)
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)'
              e.currentTarget.style.boxShadow = '0 10px 22px rgba(0,0,0,0.2)'
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(147, 51, 234, 0.12))'
              e.currentTarget.style.borderImage = 'linear-gradient(90deg, var(--accent), rgba(96,165,250,0.8)) 1'
              e.currentTarget.style.border = '2px solid transparent'
            }}
            onMouseLeave={(e) => {
              setHoveredId(null)
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)'
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(147, 51, 234, 0.08))'
              e.currentTarget.style.borderImage = ''
              e.currentTarget.style.border = '2px solid transparent'
            }}
            onFocus={() => setActiveId(item.id)}
            onClickCapture={() => setActiveId(item.id)}
          >
            <div style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#93c5fd',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.6px'
            }}>{item.name}</div>
            <div style={{
              perspective: '1200px'
            }}>
              <div style={{
                position: 'relative',
                height: '260px',
                transformStyle: 'preserve-3d',
                transition: 'transform 500ms ease, opacity 200ms ease',
                transform: hoveredId === item.id ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}>
                {/* Front face */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'white',
                  color: 'black',
                  borderRadius: '8px',
                  border: '1px solid #eee',
                  overflow: 'hidden',
                  backfaceVisibility: 'hidden'
                }}>
                  <FadeIn key={`${item.id}-front`}>
                    <div style={{ transform: 'scale(0.6)', transformOrigin: 'top left' }}>
                      <PreviewCanvas resume={item.resume} />
                    </div>
                  </FadeIn>
                </div>
                {/* Back face */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, #1f2937, #111827)',
                  color: 'white',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '16px',
                  transform: 'rotateY(180deg)',
                  backfaceVisibility: 'hidden'
                }}>
                  <div style={{ fontWeight: 700 }}>{item.name} Template</div>
                  <div style={{ fontSize: '12px', opacity: 0.9, textAlign: 'center' }}>
                    Click to preview how your resume will look.
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div role="dialog" aria-modal="true" aria-label={`${selected.name} preview`} style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}
        onClick={() => setSelected(null)}
        >
          <div style={{
            background: 'white',
            color: 'black',
            borderRadius: '12px',
            width: 'min(900px, 95vw)',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} aria-label="Close preview" style={{
              position: 'absolute',
              top: 10,
              right: 10,
              border: 'none',
              background: 'transparent',
              fontSize: '20px',
              cursor: 'pointer'
            }}>×</button>
            <div style={{ padding: '20px' }}>
              <h3 style={{ marginTop: 0 }}>{selected.name} Template Preview</h3>
              <CrossFade key={selected.id}>
                <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
                  <PreviewCanvas resume={selected.resume} />
                </div>
              </CrossFade>
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', color: '#555' }}>This is how your resume will look.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FadeIn({ children }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 250ms ease'
      el.style.opacity = '1'
    })
  }, [])
  return <div ref={ref}>{children}</div>
}

function CrossFade({ children }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    setVisible(false)
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [children])
  return (
    <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 250ms ease' }}>
      {children}
    </div>
  )
}


