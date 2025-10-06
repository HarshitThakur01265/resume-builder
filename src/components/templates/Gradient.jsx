export default function GradientTemplate({ data }) {
  const personal = data?.personal || {}
  const summary = data?.summary || ''
  const experience = Array.isArray(data?.experience) ? data.experience : []
  const education = Array.isArray(data?.education) ? data.education : []
  const skills = Array.isArray(data?.skills) ? data.skills : []
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#0f172a' }}>
      <div style={{ background: 'linear-gradient(135deg,#93c5fd,#a78bfa)', color: 'white', padding: 10, borderRadius: 8, marginBottom: 10 }}>
        <div style={{ fontSize: 24, fontWeight: 800 }}>{personal.name || 'Your Name'}</div>
        <div style={{ opacity: 0.9, fontSize: 13 }}>{personal.email || ''}</div>
      </div>
      {summary && <div style={{ marginBottom: 10 }}>{summary}</div>}
      {experience.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: '#2563eb' }}>Experience</div>
          {experience.map((x, i) => (
            <div key={i} style={{ marginTop: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{x.role || 'Role'}</strong>
                <span style={{ color: '#64748b', fontSize: 12 }}>{x.period || ''}</span>
              </div>
              <div style={{ color: '#64748b' }}>{x.company || ''}</div>
              {x.summary && <div style={{ whiteSpace: 'pre-wrap', marginTop: 4 }}>{x.summary}</div>}
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: '#2563eb' }}>Education</div>
          {education.map((e, i) => (
            <div key={i} style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
              <strong>{e.degree || 'Degree'}</strong>
              <span style={{ color: '#64748b', fontSize: 12 }}>{e.year || ''}</span>
            </div>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div>
          <div style={{ fontWeight: 800, fontSize: 13, color: '#2563eb' }}>Skills</div>
          <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {skills.filter(Boolean).map((s, i) => (<span key={i} style={{ background: '#eff6ff', color: '#1e40af', padding: '2px 6px', borderRadius: 4 }}>{s}</span>))}
          </div>
        </div>
      )}
    </div>
  )
}




