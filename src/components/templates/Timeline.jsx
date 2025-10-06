export default function TimelineTemplate({ data }) {
  const personal = data?.personal || {}
  const summary = data?.summary || ''
  const experience = Array.isArray(data?.experience) ? data.experience : []
  const education = Array.isArray(data?.education) ? data.education : []
  const skills = Array.isArray(data?.skills) ? data.skills : []
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#0f172a' }}>
      <div style={{ fontSize: 26, fontWeight: 800 }}>{personal.name || 'Your Name'}</div>
      <div style={{ color: '#64748b', fontSize: 13 }}>{personal.email || ''}</div>
      {summary && <div style={{ margin: '8px 0 12px' }}>{summary}</div>}
      <div style={{ position: 'relative', paddingLeft: 16 }}>
        <div style={{ position: 'absolute', left: 5, top: 0, bottom: 0, width: 2, background: '#e2e8f0' }} />
        {experience.map((x, i) => (
          <div key={i} style={{ marginBottom: 12, position: 'relative' }}>
            <div style={{ position: 'absolute', left: -1, top: 6, width: 6, height: 6, background: '#3b82f6', borderRadius: 999 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{x.role || 'Role'}</strong>
              <span style={{ color: '#64748b', fontSize: 12 }}>{x.period || ''}</span>
            </div>
            <div style={{ color: '#64748b' }}>{x.company || ''}</div>
            {x.summary && <div style={{ whiteSpace: 'pre-wrap', marginTop: 4 }}>{x.summary}</div>}
          </div>
        ))}
      </div>
      {education.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 800, fontSize: 13 }}>Education</div>
          {education.map((e, i) => (<div key={i} style={{ marginTop: 6 }}><strong>{e.degree || 'Degree'}</strong> <span style={{ color: '#64748b', fontSize: 12 }}>{e.year || ''}</span></div>))}
        </div>
      )}
      {skills.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 800, fontSize: 13 }}>Skills</div>
          <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {skills.filter(Boolean).map((s, i) => (<span key={i} style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: 4 }}>{s}</span>))}
          </div>
        </div>
      )}
    </div>
  )
}











