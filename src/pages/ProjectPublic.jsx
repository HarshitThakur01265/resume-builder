import { useMemo } from 'react'

export default function ProjectPublicPage() {
  const params = new URLSearchParams(window.location.search)
  const dataParam = params.get('data')
  const titleParam = params.get('t')

  const project = useMemo(() => {
    try {
      if (!dataParam) return null
      const json = decodeURIComponent(escape(atob(dataParam)))
      return JSON.parse(json)
    } catch {
      return null
    }
  }, [dataParam])

  if (!project) {
    return (
      <div className="page-glass-wrapper">
        <div className="glass-container glass-border" style={{ maxWidth: 900, padding: '40px' }}>
          <h2 style={{ margin: 0, color: 'var(--text)' }}>Project</h2>
          <p style={{ color: 'var(--muted)' }}>Invalid or missing project data.</p>
        </div>
      </div>
    )
  }

  const hasImages = Array.isArray(project.images) && project.images.length > 0

  return (
    <div className="page-glass-wrapper">
      <div className="glass-container glass-border" style={{ maxWidth: 980, padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
          <h2 style={{ margin: 0, color: 'var(--text)' }}>{project.title || 'Project'}</h2>
          {titleParam && (
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>from {titleParam}</div>
          )}
        </div>
        {project.shortDescription && (
          <p style={{ color: 'var(--muted)', marginTop: 6 }}>{project.shortDescription}</p>
        )}

        {hasImages && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10, marginTop: 16 }}>
            {project.images.map((src, i) => (
              <img key={i} src={src} alt={`Project image ${i + 1}`} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }} />
            ))}
          </div>
        )}

        {project.description && (
          <p style={{ color: 'var(--muted)', marginTop: 16, whiteSpace: 'pre-wrap' }}>{project.description}</p>
        )}

        {project.videoUrl && (
          <div style={{ marginTop: 16 }}>
            <div style={{ position: 'relative', paddingTop: '56.25%' }}>
              <iframe
                src={project.videoUrl}
                title="Project video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', borderRadius: 8 }}
              />
            </div>
          </div>
        )}

        {project.liveUrl && (
          <div style={{ marginTop: 16 }}>
            <div style={{ height: 480 }}>
              <iframe
                src={project.liveUrl}
                title="Live project"
                style={{ width: '100%', height: '100%', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              />
            </div>
          </div>
        )}

        {(project.figmaUrl || project.githubUrl || project.link) && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
            {project.figmaUrl && (
              <a className="glass-button" href={project.figmaUrl} target="_blank" rel="noreferrer">Figma</a>
            )}
            {project.githubUrl && (
              <a className="glass-button" href={project.githubUrl} target="_blank" rel="noreferrer">GitHub</a>
            )}
            {project.link && (
              <a className="glass-button" href={project.link} target="_blank" rel="noreferrer">Visit</a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


