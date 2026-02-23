import { useState } from 'react'
import PreviewCanvas from './PreviewCanvas'

// All templates with labels and tags for filter + display
export const TEMPLATE_OPTIONS = [
  { id: 'classic', label: 'Classic', tags: ['ATS Friendly', 'Executive'] },
  { id: 'modern', label: 'Modern', tags: ['Modern'] },
  { id: 'minimal', label: 'Minimal', tags: ['ATS Friendly', 'Modern'] },
  { id: 'professional', label: 'Professional', tags: ['ATS Friendly', 'Executive'] },
  { id: 'creative', label: 'Creative', tags: ['Creative'] },
  { id: 'compact', label: 'Compact', tags: ['ATS Friendly'] },
  { id: 'academic', label: 'Academic', tags: ['ATS Friendly', 'Executive'] },
  { id: 'fresher', label: 'Fresher / Student ATS', tags: ['ATS Friendly'] },
  { id: 'business', label: 'Business', tags: ['Executive'] },
  { id: 'technical', label: 'Technical', tags: ['Modern'] },
  { id: 'sidebar', label: 'Sidebar', tags: ['Modern'] },
  { id: 'elegant', label: 'Elegant', tags: ['Creative', 'Executive'] },
  { id: 'gradient', label: 'Gradient', tags: ['Modern', 'Creative'] },
  { id: 'timeline', label: 'Timeline', tags: ['Modern'] },
  { id: 'two-column', label: 'Two Column', tags: ['Modern'] },
  { id: 'ats', label: 'ATS', tags: ['ATS Friendly'] },
  { id: 'infographic', label: 'Infographic', tags: ['Creative'] }
]

const sampleResume = {
  title: 'Sample Resume',
  template: 'classic',
  content: {
    personal: { name: 'Your Name', email: 'you@example.com', phone: '+1 234 567 8900' },
    links: { github: '', linkedin: '', website: '' },
    summary: 'Professional summary or career objective goes here.',
    education: [{ degree: 'B.Sc. Computer Science', institution: 'University', year: '2024' }],
    experience: [{ role: 'Role', company: 'Company', period: '2022 – Present', responsibilities: 'Key points.' }],
    skills: ['Skill 1', 'Skill 2', 'Skill 3']
  }
}

// Scale so a ~794px-wide resume fits in the thumbnail box; box width drives scale
const THUMB_WIDTH = 180
const THUMB_HEIGHT = 234
const RESUME_WIDTH = 794
const SCALE = THUMB_WIDTH / RESUME_WIDTH

function TemplateThumbnail({ templateId }) {
  const resume = { ...sampleResume, template: templateId }
  return (
    <div
      style={{
        position: 'relative',
        width: THUMB_WIDTH,
        height: THUMB_HEIGHT,
        background: '#fff',
        borderRadius: 6,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        flexShrink: 0
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: `scale(${SCALE})`,
          transformOrigin: 'top left',
          width: RESUME_WIDTH,
          minHeight: 1123,
          background: '#fff',
          color: '#000'
        }}
      >
        <PreviewCanvas resume={resume} />
      </div>
    </div>
  )
}

export default function TemplateSelector({ value, onChange, disabled, compact = false }) {
  const [filterTag, setFilterTag] = useState(null)

  const filtered = filterTag
    ? TEMPLATE_OPTIONS.filter((t) => t.tags.includes(filterTag))
    : TEMPLATE_OPTIONS

  const uniqueTags = [...new Set(TEMPLATE_OPTIONS.flatMap((t) => t.tags))]
  const cardMin = compact ? 200 : 220

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Tag filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <span style={{ color: 'var(--muted)', fontSize: 13, marginRight: 4 }}>Filter:</span>
        <button
          type="button"
          onClick={() => setFilterTag(null)}
          className="option-pill small"
          style={{
            background: !filterTag ? 'rgba(59, 130, 246, 0.2)' : undefined,
            borderColor: !filterTag ? 'rgba(59, 130, 246, 0.5)' : undefined
          }}
        >
          All
        </button>
        {uniqueTags.map((tag) => (
          <button
            key={tag}
            type="button"
            className="option-pill small"
            onClick={() => setFilterTag(filterTag === tag ? null : tag)}
            style={{
              background: filterTag === tag ? 'rgba(59, 130, 246, 0.2)' : undefined,
              borderColor: filterTag === tag ? 'rgba(59, 130, 246, 0.5)' : undefined
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Template cards with visual thumbnail + label + tags */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, minmax(${cardMin}px, 1fr))`,
          gap: 16
        }}
      >
        {filtered.map((opt) => {
          const isSelected = value === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.id)}
              className="option-pill"
              style={{
                width: '100%',
                padding: 0,
                overflow: 'hidden',
                borderColor: isSelected ? 'rgba(59, 130, 246, 0.8)' : 'rgba(255,255,255,0.12)',
                background: isSelected ? 'rgba(59, 130, 246, 0.12)' : 'rgba(255,255,255,0.04)',
                boxShadow: isSelected ? '0 0 0 2px rgba(59, 130, 246, 0.4)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                textAlign: 'left',
                transition: 'border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              {/* Thumbnail: clean section preview */}
              <div
                style={{
                  padding: 10,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  background: 'rgba(0,0,0,0.15)',
                  minHeight: THUMB_HEIGHT + 20
                }}
              >
                <TemplateThumbnail templateId={opt.id} />
              </div>
              {/* Label + tags */}
              <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{opt.label}</span>
                <span style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {opt.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 10,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: 'rgba(255,255,255,0.08)',
                        color: 'var(--muted)'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
