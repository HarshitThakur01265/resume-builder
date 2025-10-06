export default function SidebarTemplate({ data }) {
  const personal = data?.personal || {}
  const summary = data?.summary || ''
  const experience = Array.isArray(data?.experience) ? data.experience : []
  const education = Array.isArray(data?.education) ? data.education : []
  const skills = Array.isArray(data?.skills) ? data.skills : []
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#111', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
      <div style={{ background: '#f1f5f9', borderRadius: 8, padding: 12 }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>{personal.name || 'Your Name'}</div>
        <div style={{ color: '#64748b', fontSize: 13 }}>{personal.email || ''}</div>
        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>Skills</div>
          <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {skills.filter(Boolean).map((s, i) => (<span key={i} style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: 4 }}>{s}</span>))}
          </div>
        </div>
        {education.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>Education</div>
            {education.map((e, i) => (<div key={i} style={{ marginTop: 4 }}><strong>{e.degree || 'Degree'}</strong> <span style={{ color: '#64748b', fontSize: 12 }}>{e.year || ''}</span></div>))}
          </div>
        )}
      </div>
      <div>
        {summary && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Summary</div>
            <div style={{ marginTop: 4 }}>{summary}</div>
          </div>
        )}
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Experience</div>
          {experience.map((x, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{x.role || 'Role'}</strong>
                <span style={{ color: '#64748b', fontSize: 12 }}>{x.period || ''}</span>
              </div>
              <div style={{ color: '#64748b', fontSize: 13 }}>{x.company || ''}</div>
              {x.summary && <div style={{ marginTop: 4, whiteSpace: 'pre-wrap' }}>{x.summary}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}




