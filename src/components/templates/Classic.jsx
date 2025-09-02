export default function ClassicTemplate({ data }) {
  const personal = data?.personal || {}
  const education = Array.isArray(data?.education) ? data.education : []
  const experience = Array.isArray(data?.experience) ? data.experience : []
  const skills = Array.isArray(data?.skills) ? data.skills : []

  return (
    <div style={{ fontFamily: 'Segoe UI, system-ui, sans-serif', color: '#e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2 style={{ margin: 0 }}>{personal.name || 'Your Name'}</h2>
        <div style={{ color: '#94a3b8' }}>{personal.email || 'you@email.com'}</div>
      </div>

      <div style={{ height: 12 }} />

      {experience.length > 0 && (
        <section>
          <h3 style={{ margin: '0 0 6px' }}>Experience</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {experience.map((x, idx) => (
              <div key={idx}>
                <strong>{x.role || 'Role'}</strong>{' '}
                <span style={{ color: '#94a3b8' }}>@ {x.company || 'Company'}</span>
                {x.summary && <div style={{ whiteSpace: 'pre-wrap' }}>{x.summary}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      <div style={{ height: 12 }} />

      {education.length > 0 && (
        <section>
          <h3 style={{ margin: '0 0 6px' }}>Education</h3>
          <div style={{ display: 'grid', gap: 6 }}>
            {education.map((x, idx) => (
              <div key={idx}>
                <strong>{x.degree || 'Degree'}</strong>{' '}
                <span style={{ color: '#94a3b8' }}>{x.year || ''}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div style={{ height: 12 }} />

      {skills.length > 0 && (
        <section>
          <h3 style={{ margin: '0 0 6px' }}>Skills</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {skills.filter(Boolean).map((s, idx) => (
              <span key={idx} style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 8px', borderRadius: 6 }}>{s}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

