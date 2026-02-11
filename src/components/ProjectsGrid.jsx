import { useState } from 'react'
import ProjectShowcaseModal from './ProjectShowcaseModal'

export default function ProjectsGrid({ projects = [], resumeTitle }) {
  const [active, setActive] = useState(null)
  const open = (p) => setActive(p)
  const close = () => setActive(null)

  if (!Array.isArray(projects) || projects.length === 0) return null

  return (
    <div>
      <h3
        style={{
          margin: '0 0 12px',
          color: '#0f172a',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: '0.02em',
          textTransform: 'uppercase'
        }}
      >
        Projects
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
        {projects.map((p, idx) => (
          <button
            key={idx}
            type="button"
            className="glass-container glass-border project-card-button"
            onClick={() => open(p)}
            style={{
              textAlign: 'left',
              padding: '16px',
              borderRadius: 16,
              border: '1px solid rgba(148, 163, 184, 0.25)',
              background: 'rgba(15, 23, 42, 0.9)'
            }}
          >
            <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: 15 }}>{p.title || 'Untitled Project'}</div>
            {p.shortDescription && (
              <div style={{ color: 'var(--muted)', marginTop: 6 }}>{p.shortDescription}</div>
            )}
            {Array.isArray(p.tech) && p.tech.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                {p.tech.slice(0, 6).map((t, i) => (
                  <span key={i} style={{ fontSize: 11, padding: '4px 6px', borderRadius: 999, background: 'rgba(96,165,250,0.12)', color: 'var(--accent)', border: '1px solid rgba(96,165,250,0.25)' }}>{t}</span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>

      <ProjectShowcaseModal project={active} isOpen={!!active} onClose={close} resumeTitle={resumeTitle} />
    </div>
  )
}



