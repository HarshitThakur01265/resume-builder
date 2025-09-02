import ClassicTemplate from './templates/Classic'
import AcademicTemplate from './templates/Academic'

export default function PreviewCanvas({ resume }) {
  const rawContent = resume?.content || {}
  const content = rawContent?.content || rawContent || {}
  const selected = (resume?.template || rawContent?.template || rawContent?._template || 'classic')

  return (
    <div style={{ background: '#111729', padding: 16, borderRadius: 8 }}>
      {selected === 'classic' && <ClassicTemplate data={content} />}
      {selected === 'academic' && <AcademicTemplate data={content} />}
    </div>
  )
}

