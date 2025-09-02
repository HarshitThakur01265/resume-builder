import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import html2pdf from 'html2pdf.js'
import { getLatestResume } from '../services/resumes'
import PreviewCanvas from '../components/PreviewCanvas'

export default function PreviewPage() {
  const [resume, setResume] = useState(null)
  const [searchParams] = useSearchParams()
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
  const handleExport = async () => {
    const node = document.getElementById('preview-area')
    if (!node) return
    const opt = {
      margin: 0,
      filename: (resume?.title || 'resume') + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: null },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }
    await html2pdf().set(opt).from(node).save()
  }

  return (
    <div>
      <h2>Preview</h2>
      <div className="pdf-container">
        <div id="preview-area" className="pdf-page">
          <PreviewCanvas resume={resume || { title: 'Resume', template: 'classic', content: {} }} />
        </div>
      </div>
      <div style={{ height: 12 }} />
      <button onClick={handleExport}>Export PDF</button>
    </div>
  )
}

