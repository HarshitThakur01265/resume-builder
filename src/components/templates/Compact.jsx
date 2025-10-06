export default function CompactTemplate({ data }) {
  const personal = data?.personal || {}
  const experience = Array.isArray(data?.experience) ? data.experience : []
  const education = Array.isArray(data?.education) ? data.education : []
  const skills = Array.isArray(data?.skills) ? data.skills : []
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: '#111' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{personal.name || 'Your Name'}</div>
        <div style={{ color: '#666', fontSize: 13 }}>{personal.email || ''}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginTop: 12 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Experience</div>
          {experience.map((x, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{x.role || 'Role'}</strong>
                <span style={{ color: '#666', fontSize: 13 }}>{x.period || ''}</span>
              </div>
              <div style={{ color: '#666' }}>{x.company || ''}</div>
              {x.summary && <div style={{ whiteSpace: 'pre-wrap', marginTop: 4 }}>{x.summary}</div>}
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Education</div>
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
              <strong>{e.degree || 'Degree'}</strong>
              <span style={{ color: '#666', fontSize: 13 }}>{e.year || ''}</span>
            </div>
          ))}
          <div style={{ fontWeight: 700, fontSize: 14, marginTop: 10, marginBottom: 6 }}>Skills</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {skills.filter(Boolean).map((s, i) => (<span key={i} style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>{s}</span>))}
          </div>
        </div>
      </div>
    </div>
  )
}



