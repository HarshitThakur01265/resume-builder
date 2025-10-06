import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import html2pdf from 'html2pdf.js'
import { getLatestResume } from '../services/resumes'
import PreviewCanvas from '../components/PreviewCanvas'
import TypingResume from '../components/TypingResume'
import LottieAnimation from '../components/LottieAnimation'
import writingAnimation from '../assets/animations/writing.json'

export default function PreviewPage() {
  const [resume, setResume] = useState(null)
  const [showTyping, setShowTyping] = useState(true)
  const [searchParams] = useSearchParams()
  const [isExporting, setIsExporting] = useState(false)
  
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
    
    const opt = {
      margin: [10, 10, 10, 10], // top, right, bottom, left margins in mm
      filename: (resume?.title || 'resume') + '.pdf',
      image: { 
        type: 'jpeg', 
        quality: 0.95 
      },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#ffffff',
        logging: false,
        letterRendering: true,
        allowTaint: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.page-break',
        after: '.avoid-break',
        avoid: '.avoid-break'
      }
    }
    
    try {
      await html2pdf().set(opt).from(node).save()
    } catch (error) {
      console.error('PDF generation failed:', error)
      alert('Failed to generate PDF. Please try again.')
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

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
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
              ) : (
                '📄 Export PDF'
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
                  resume={resume || { title: 'Resume', template: 'classic', content: {} }} 
                  onComplete={handleTypingComplete}
                />
              ) : (
                <PreviewCanvas resume={resume || { title: 'Resume', template: 'classic', content: {} }} />
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