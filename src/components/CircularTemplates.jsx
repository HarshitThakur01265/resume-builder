import { useMemo, useState } from 'react'
import PreviewCanvas from './PreviewCanvas'
import './CircularTemplates.css'

const allTemplates = [
  { id: 'classic', name: 'Classic' },
  { id: 'academic', name: 'Academic' },
  { id: 'modern', name: 'Modern' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'creative', name: 'Creative' },
  { id: 'compact', name: 'Compact' },
  { id: 'professional', name: 'Professional' },
  { id: 'technical', name: 'Technical' },
  { id: 'business', name: 'Business' },
  { id: 'sidebar', name: 'Sidebar' },
  { id: 'elegant', name: 'Elegant' },
  { id: 'gradient', name: 'Gradient' },
  { id: 'timeline', name: 'Timeline' },
  { id: 'two-column', name: 'Two Column' },
  { id: 'ats', name: 'ATS' },
  { id: 'infographic', name: 'Infographic' }
]

function buildDemoResume(templateId, name) {
  return {
    template: templateId,
    content: {
      personal: { name: name + ' Sample', email: 'sample@example.com' },
      summary: 'Demonstration content for previewing template layout.',
      experience: [
        { role: 'Software Engineer', company: 'Acme Corp', period: '2022–Present', summary: 'Built delightful UIs and performant APIs.' }
      ],
      education: [
        { degree: 'B.Sc. Computer Science', year: '2020' }
      ],
      skills: ['React', 'TypeScript', 'CSS']
    }
  }
}

export default function CircularTemplates() {
  const [selected, setSelected] = useState(null)

  const items = useMemo(() => {
    return allTemplates.map(t => ({
      id: t.id,
      name: t.name,
      resume: buildDemoResume(t.id, t.name)
    }))
  }, [])

  return (
    <div className="circular-templates-section">
      <div className="circular-title">All Templates</div>
      <div className="circular-subtitle">Click any card to open a live preview</div>
      <div className="circular-gallery">
        {items.map((item, index) => (
          <button
            key={item.id}
            className="circular-item"
            style={{
              '--index': index,
              '--total': items.length
            }}
            onClick={() => setSelected(item)}
            aria-label={`Open ${item.name} preview`}
          >
            <div className="circular-card">
              <div className="circular-card-front">
                <div className="circular-thumb">
                  <div style={{ transform: 'scale(0.42)', transformOrigin: 'top left', width: 0, height: 0 }}>
                    <PreviewCanvas resume={item.resume} />
                  </div>
                </div>
              </div>
              <div className="circular-card-label">{item.name}</div>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selected.name} preview`}
          className="circular-modal-backdrop"
          onClick={() => setSelected(null)}
        >
          <div className="circular-modal" onClick={(e) => e.stopPropagation()}>
            <button className="circular-modal-close" onClick={() => setSelected(null)} aria-label="Close preview">×</button>
            <div className="circular-modal-body">
              <h3 className="circular-modal-title">{selected.name} Template Preview</h3>
              <div className="circular-modal-canvas">
                <PreviewCanvas resume={selected.resume} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}






