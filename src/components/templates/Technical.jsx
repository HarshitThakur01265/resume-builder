export default function TechnicalTemplate({ data }) {
  const personal = data?.personal || {}
  const summary = data?.summary || ''
  const experience = Array.isArray(data?.experience) ? data.experience : []
  const education = Array.isArray(data?.education) ? data.education : []
  const skills = Array.isArray(data?.skills) ? data.skills : []
  const techStack = (data?.techStack && Array.isArray(data.techStack)) ? data.techStack : []
  return (
    <div style={{ fontFamily: 'Consolas, Menlo, monospace', color: '#0b0f19' }}>
      <div style={{ fontSize: 24, fontWeight: 800 }}>{personal.name || 'Your Name'} <span style={{ color: '#64748b', fontSize: 14 }}>— {personal.email || ''}</span></div>
      {summary && <div style={{ margin: '8px 0 12px' }}>{summary}</div>}
      {techStack.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>Tech Stack</div>
          <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {techStack.map((t, i) => (<span key={i} style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: 4 }}>{t}</span>))}
          </div>
        </div>
      )}
      <div style={{ display: 'grid', gap: 12 }}>
        {experience.map((x, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{x.role || 'Role'}</strong>
              <span style={{ color: '#64748b', fontSize: 12 }}>{x.period || ''}</span>
            </div>
            <div style={{ color: '#64748b', fontSize: 13 }}>{x.company || ''}</div>
            {x.points && Array.isArray(x.points) ? (
              <ul style={{ margin: '6px 0 0 16px' }}>
                {x.points.map((p, idx) => (<li key={idx}>{p}</li>))}
              </ul>
            ) : x.summary ? (
              <div style={{ marginTop: 4, whiteSpace: 'pre-wrap' }}>{x.summary}</div>
            ) : null}
          </div>
        ))}
      </div>
      {education.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>Education</div>
          {education.map((e, i) => (<div key={i}><strong>{e.degree || 'Degree'}</strong> <span style={{ color: '#64748b', fontSize: 12 }}>{e.year || ''}</span></div>))}
        </div>
      )}
      {skills.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>Skills</div>
          <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {skills.filter(Boolean).map((s, i) => (<span key={i} style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: 4 }}>{s}</span>))}
          </div>
        </div>
      )}
    </div>
  )
}



