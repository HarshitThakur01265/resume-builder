export default function CreativeTemplate({ data }) {
  const personal = data?.personal || {}
  const summary = data?.summary || ''
  const experience = Array.isArray(data?.experience) ? data.experience : []
  const education = Array.isArray(data?.education) ? data.education : []
  const skills = Array.isArray(data?.skills) ? data.skills : []
  return (
    <div style={{ fontFamily: 'Poppins, system-ui, sans-serif', color: '#111827' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{ width: 8, height: 32, background: '#3b82f6', borderRadius: 4 }} />
        <div style={{ fontSize: 26, fontWeight: 800 }}>{personal.name || 'Your Name'}</div>
      </div>
      {summary && <div style={{ marginBottom: 12 }}>{summary}</div>}
      {experience.length > 0 && (
        <section style={{ marginBottom: 12 }}>
          <div style={{ color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}>Experience</div>
          <div style={{ marginTop: 6, display: 'grid', gap: 8 }}>
            {experience.map((x, i) => (
              <div key={i} style={{ borderLeft: '3px solid #93c5fd', paddingLeft: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{x.role || 'Role'}</strong>
                  <span style={{ color: '#6b7280', fontSize: 13 }}>{x.period || ''}</span>
                </div>
                <div style={{ color: '#6b7280', fontSize: 14 }}>{x.company || ''}</div>
                {x.summary && <div style={{ whiteSpace: 'pre-wrap', marginTop: 4 }}>{x.summary}</div>}
              </div>
            ))}
          </div>
        </section>
      )}
      {education.length > 0 && (
        <section style={{ marginBottom: 12 }}>
          <div style={{ color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}>Education</div>
          <div style={{ marginTop: 6, display: 'grid', gap: 6 }}>
            {education.map((e, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div><strong>{e.degree || 'Degree'}</strong></div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>{e.year || ''}</div>
              </div>
            ))}
          </div>
        </section>
      )}
      {skills.length > 0 && (
        <section>
          <div style={{ color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}>Skills</div>
          <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {skills.filter(Boolean).map((s, i) => (<span key={i} style={{ background: '#eff6ff', color: '#1e3a8a', padding: '4px 8px', borderRadius: 999 }}>{s}</span>))}
          </div>
        </section>
      )}
    </div>
  )
}



