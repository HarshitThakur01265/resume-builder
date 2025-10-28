import { useEffect, useMemo, useState, useCallback } from 'react'

export default function ProjectShowcaseModal({ project, isOpen, onClose, resumeTitle }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  // Compute flags before any callbacks reference them to avoid TDZ errors
  const hasImages = project ? Array.isArray(project.images) && project.images.length > 0 : false
  const hasVideo = !!(project && project.videoUrl)
  const hasLive = !!(project && project.liveUrl)
  const hasFigma = !!(project && project.figmaUrl)
  const hasGithub = !!(project && project.githubUrl)
  const nextImage = useCallback(() => {
    if (!hasImages) return
    setActiveImageIndex((i) => (i + 1) % project.images.length)
  }, [hasImages, project])

  const prevImage = useCallback(() => {
    if (!hasImages) return
    setActiveImageIndex((i) => (i - 1 + project.images.length) % project.images.length)
  }, [hasImages, project])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }
    if (isOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose, nextImage, prevImage])

  

  const shareUrl = useMemo(() => {
    try {
      if (!project) return ''
      const payload = { ...project }
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
      const base = window.location.origin
      const params = new URLSearchParams()
      params.set('data', encoded)
      if (resumeTitle) params.set('t', resumeTitle)
      return `${base}/project?${params.toString()}`
    } catch {
      return ''
    }
  }, [project, resumeTitle])

  const copyShare = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      alert('Share link copied to clipboard')
    } catch {
      prompt('Copy this link:', shareUrl)
    }
  }

  

  if (!isOpen || !project) return null

  return (
    <div 
      className="modal-backdrop"
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title || 'Project details'}
    >
      <div 
        className="modal-content glass-container glass-border"
        style={{
          width: 'min(1000px, 95vw)', maxHeight: '90vh', overflow: 'auto', background: 'var(--panel, #0b1220)', padding: '20px', borderRadius: '16px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <h3 style={{ margin: 0, color: 'var(--text)' }}>{project.title || 'Untitled Project'}</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            {shareUrl && (
              <button className="glass-button" onClick={copyShare} title="Copy share link">🔗 Share</button>
            )}
            <button className="glass-button" onClick={onClose} aria-label="Close">✕</button>
          </div>
        </div>

        {project.description && (
          <p style={{ color: 'var(--muted)', marginTop: '8px', whiteSpace: 'pre-wrap' }}>{project.description}</p>
        )}

        <div style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
          {hasImages && (
            <div>
              <h4 style={{ margin: '0 0 8px', color: 'var(--text)' }}>Images</h4>
              <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                <img 
                  src={project.images[activeImageIndex]} 
                  alt={`Project image ${activeImageIndex + 1}`} 
                  style={{ width: '100%', maxHeight: 420, objectFit: 'cover', display: 'block' }}
                />
                {project.images.length > 1 && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
                    <button className="glass-button" onClick={prevImage} aria-label="Previous image">◀</button>
                    <button className="glass-button" onClick={nextImage} aria-label="Next image">▶</button>
                  </div>
                )}
              </div>
              {project.images.length > 1 && (
                <div style={{ display: 'flex', gap: 6, marginTop: 8, justifyContent: 'center' }}>
                  {project.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={i === activeImageIndex ? 'indicator active' : 'indicator'}
                      aria-label={`Go to image ${i + 1}`}
                      style={{ width: 8, height: 8, borderRadius: 999, border: 'none', background: i === activeImageIndex ? 'var(--accent)' : 'rgba(255,255,255,0.25)' }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {hasVideo && (
            <div>
              <h4 style={{ margin: '0 0 8px', color: 'var(--text)' }}>Video</h4>
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

          {hasLive && (
            <div>
              <h4 style={{ margin: '0 0 8px', color: 'var(--text)' }}>Live Embed</h4>
              <div style={{ height: 420 }}>
                <iframe
                  src={project.liveUrl}
                  title="Live project"
                  style={{ width: '100%', height: '100%', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
                />
              </div>
            </div>
          )}

          {(hasFigma || hasGithub) && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {hasFigma && (
                <a className="glass-button" href={project.figmaUrl} target="_blank" rel="noreferrer">Figma</a>
              )}
              {hasGithub && (
                <a className="glass-button" href={project.githubUrl} target="_blank" rel="noreferrer">GitHub</a>
              )}
              {project.link && (
                <a className="glass-button" href={project.link} target="_blank" rel="noreferrer">Visit</a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



