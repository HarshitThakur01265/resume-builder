export default function MinimalTemplate({ data }) {
  const personal = data?.personal || {}
  const summary = data?.summary || ''
  const experience = Array.isArray(data?.experience) ? data.experience : []
  const education = Array.isArray(data?.education) ? data.education : []
  const skills = Array.isArray(data?.skills) ? data.skills : []

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: '#111', lineHeight: 1.5 }}>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{personal.name || 'Your Name'}</div>
      <div style={{ color: '#555', fontSize: 13, marginBottom: 10 }}>{personal.email || ''}</div>
      {summary && <div style={{ marginBottom: 14 }}>{summary}</div>}
      {experience.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Experience</div>
          {experience.map((x, i) => (
            <div key={i} style={{ marginTop: 6 }}>
              <div><strong>{x.role || 'Role'}</strong> {x.company ? `@ ${x.company}` : ''}</div>
              {x.summary && <div style={{ whiteSpace: 'pre-wrap', color: '#333' }}>{x.summary}</div>}
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Education</div>
          {education.map((e, i) => (
            <div key={i} style={{ marginTop: 6 }}>
              <div><strong>{e.degree || 'Degree'}</strong> {e.year ? `• ${e.year}` : ''}</div>
            </div>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Skills</div>
          <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {skills.filter(Boolean).map((s, i) => (<span key={i} style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>{s}</span>))}
          </div>
        </div>
      )}
    </div>
  )
}



