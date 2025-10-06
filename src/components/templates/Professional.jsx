export default function ProfessionalTemplate({ data }) {
  const personal = data?.personal || {}
  const summary = data?.summary || ''
  const experience = Array.isArray(data?.experience) ? data.experience : []
  const education = Array.isArray(data?.education) ? data.education : []
  const skills = Array.isArray(data?.skills) ? data.skills : []
  return (
    <div style={{ fontFamily: 'Segoe UI, system-ui, sans-serif', color: '#111827' }}>
      <div style={{ borderBottom: '3px solid #1f2937', paddingBottom: 6, marginBottom: 10 }}>
        <div style={{ fontSize: 26, fontWeight: 800 }}>{personal.name || 'Your Name'}</div>
        <div style={{ color: '#6b7280', fontSize: 13 }}>{personal.email || ''}</div>
      </div>
      {summary && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Summary</div>
          <div style={{ marginTop: 4 }}>{summary}</div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Experience</div>
          {experience.map((x, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{x.role || 'Role'}</strong>
                <span style={{ color: '#6b7280', fontSize: 13 }}>{x.period || ''}</span>
              </div>
              <div style={{ color: '#6b7280', fontSize: 14 }}>{x.company || ''}</div>
              {x.summary && <div style={{ marginTop: 4, whiteSpace: 'pre-wrap' }}>{x.summary}</div>}
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Education</div>
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
              <strong>{e.degree || 'Degree'}</strong>
              <span style={{ color: '#6b7280', fontSize: 13 }}>{e.year || ''}</span>
            </div>
          ))}
          <div style={{ fontWeight: 700, fontSize: 14, marginTop: 10, marginBottom: 6 }}>Skills</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {skills.filter(Boolean).map((s, i) => (<span key={i} style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: 4 }}>{s}</span>))}
          </div>
        </div>
      </div>
    </div>
  )
}



