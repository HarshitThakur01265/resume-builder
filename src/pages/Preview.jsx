import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import html2pdf from 'html2pdf.js'
import html2canvas from 'html2canvas'
import { getLatestResume } from '../services/resumes'
import PreviewCanvas from '../components/PreviewCanvas'
import TypingResume from '../components/TypingResume'
import LottieAnimation from '../components/LottieAnimation'
import writingAnimation from '../assets/animations/writing.json'

const TEMPLATE_OPTIONS = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'professional', label: 'Professional' },
  { id: 'creative', label: 'Creative' },
  { id: 'compact', label: 'Compact' },
  { id: 'academic', label: 'Academic' },
  { id: 'fresher', label: 'Fresher / Student ATS' },
  { id: 'business', label: 'Business' },
  { id: 'technical', label: 'Technical' },
  { id: 'sidebar', label: 'Sidebar' },
  { id: 'elegant', label: 'Elegant' },
  { id: 'gradient', label: 'Gradient' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'two-column', label: 'Two Column' },
  { id: 'ats', label: 'ATS' },
  { id: 'infographic', label: 'Infographic' }
]

const EXPORT_FORMATS = [
  { id: 'pdf', label: 'PDF' },
  { id: 'jpg', label: 'JPG' }
]

export default function PreviewPage() {
  const [resume, setResume] = useState(null)
  const [showTyping, setShowTyping] = useState(true)
  const [searchParams] = useSearchParams()
  const [isExporting, setIsExporting] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('classic')
  const [exportFormat, setExportFormat] = useState('pdf')
  
  useEffect(() => {
    const id = searchParams.get('id')
    const getter = id ? import('../services/resumes').then(m => m.getResume(id)) : getLatestResume()
    Promise.resolve(getter).then((r) => {
      // Some rows may store the entire resume in content; normalize
      if (r && !r.title && r.content?.title) {
        setResume(r.content)
      } else {
        setResume(r)
      }
    }).catch(() => setResume(null))
  }, [searchParams])

  useEffect(() => {
    if (!resume) return
    const incomingTemplate = resume.template || resume.content?.template || resume.content?._template
    if (incomingTemplate) {
      setSelectedTemplate(incomingTemplate)
    }
  }, [resume])

  const previewResume = useMemo(() => {
    const baseResume = resume || { title: 'Resume', template: 'classic', content: {} }
    return {
      ...baseResume,
      template: selectedTemplate
    }
  }, [resume, selectedTemplate])

  const safeTitle = useMemo(() => {
    const fallback = 'resume'
    const base = (previewResume?.title || fallback).trim()
    const sanitized = base.replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, '-').toLowerCase()
    return sanitized || fallback
  }, [previewResume])

  const handleTypingComplete = () => {
    setShowTyping(false)
  }

  const handleExport = async () => {
    const node = document.getElementById('preview-area')
    if (!node) return
    
    setIsExporting(true)
    
    // Temporarily apply print styles
    const originalStyles = node.style.cssText
    node.style.background = 'white'
    node.style.color = 'black'
    node.style.boxShadow = 'none'
    node.style.borderRadius = '0'
    
    try {
      const width = node.scrollWidth
      const height = node.scrollHeight
      if (exportFormat === 'jpg') {
        const canvas = await html2canvas(node, {
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: width,
          windowHeight: height
        })
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
        const link = document.createElement('a')
        link.href = dataUrl
        link.download = `${safeTitle}-${selectedTemplate}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        // A4 at 96 DPI; multi-page PDF (no scaling — content flows to next pages)
        const A4_WIDTH = 794
        const A4_HEIGHT = 1123
        const opt = {
          margin: [20, 20, 20, 20],
          filename: `${safeTitle}-${selectedTemplate}.pdf`,
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            letterRendering: true,
            allowTaint: true,
            windowWidth: width,
            windowHeight: height
          },
          jsPDF: {
            unit: 'px',
            format: [A4_WIDTH, A4_HEIGHT],
            orientation: 'portrait',
            compress: true
          },
          pagebreak: { mode: ['css', 'legacy'] }
        }
        await html2pdf().set(opt).from(node).save()
      }
    } catch (error) {
      console.error('PDF generation failed:', error)
      alert('Failed to export resume. Please try again.')
    } finally {
      // Restore original styles
      node.style.cssText = originalStyles
      setIsExporting(false)
    }
  }

  return (
    <div className="page-glass-wrapper">
      <div style={{ maxWidth: '1000px', width: '100%', padding: '20px' }}>
        <div className="glass-container glass-border" style={{ padding: '40px', marginBottom: '20px' }}>
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
              Resume Preview
            </h2>
            <p style={{ color: 'var(--muted)', marginTop: '8px', fontSize: '16px' }}>
              {resume ? `Previewing: ${resume.title}` : 'Loading resume...'}
            </p>
          </div>

          <div className="export-options-grid">
            <div className="export-option">
              <label className="export-option-label" htmlFor="template-select">
                Template
              </label>
              <select
                id="template-select"
                className="glass-input"
                value={selectedTemplate}
                onChange={(e) => {
                  setSelectedTemplate(e.target.value)
                  setShowTyping(false)
                }}
                disabled={isExporting}
              >
                {TEMPLATE_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="export-option">
              <div className="export-option-label">Export format</div>
              <div className="format-options">
                {EXPORT_FORMATS.map((format) => (
                  <button
                    key={format.id}
                    type="button"
                    className={`option-pill small ${exportFormat === format.id ? 'active' : ''}`}
                    onClick={() => setExportFormat(format.id)}
                    disabled={isExporting}
                  >
                    {format.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
            <button 
              className="glass-button" 
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <LottieAnimation
                  animationData={writingAnimation}
                  width={20}
                  height={20}
                  className="loading-animation"
                  loop={true}
                  autoplay={true}
                />
              ) : exportFormat === 'pdf' ? (
                '📄 Export PDF'
              ) : (
                '🖼️ Export JPG'
              )}
            </button>
            <button 
              className="glass-button" 
              onClick={() => setShowTyping(true)}
              disabled={showTyping}
            >
              ✨ Replay Typing
            </button>
          </div>
        </div>

        <div className="glass-container glass-border" style={{ padding: '20px', minHeight: '800px' }}>
          <div className="pdf-container">
            <div 
              id="preview-area" 
              className="pdf-page pen-stage"
              style={{
                border: 'none',
                background: 'white',
                color: 'black',
                backdropFilter: 'none'
              }}
            >
              {showTyping ? (
                <TypingResume 
                  resume={previewResume} 
                  onComplete={handleTypingComplete}
                />
              ) : (
                <PreviewCanvas resume={previewResume} />
              )}
            </div>
          </div>
        </div>

        {showTyping && (
          <div className="glass-container" style={{ 
            padding: '16px', 
            marginTop: '20px',
            background: 'rgba(96, 165, 250, 0.05)',
            border: '1px solid rgba(96, 165, 250, 0.2)',
            textAlign: 'center' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <LottieAnimation
                animationData={writingAnimation}
                width={24}
                height={24}
                className="loading-animation"
                loop={true}
                autoplay={true}
              />
              <span style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: 500 }}>
                Creating your resume...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}