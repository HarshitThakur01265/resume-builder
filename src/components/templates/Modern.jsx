export default function ModernTemplate({ data }) {
  const personal = data?.personal || {}
  const summary = data?.summary || ''
  const experience = Array.isArray(data?.experience) ? data.experience : []
  const education = Array.isArray(data?.education) ? data.education : []
  const skills = Array.isArray(data?.skills) ? data.skills : []

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#0f172a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
        <div style={{ fontSize: 26, fontWeight: 800 }}>{personal.name || 'Your Name'}</div>
        <div style={{ color: '#475569', fontSize: 14 }}>{personal.email || 'you@email.com'}</div>
      </div>
      {summary && (
        <section style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 13, color: '#334155' }}>Summary</div>
          <div style={{ marginTop: 6, lineHeight: 1.5 }}>{summary}</div>
        </section>
      )}
      {experience.length > 0 && (
        <section style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 13, color: '#334155' }}>Experience</div>
          <div style={{ marginTop: 8, display: 'grid', gap: 10 }}>
            {experience.map((x, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong>{x.role || 'Role'}</strong>
                  <span style={{ color: '#64748b', fontSize: 13 }}>{x.period || ''}</span>
                </div>
                <div style={{ color: '#64748b', fontSize: 14 }}>{x.company || ''}</div>
                {x.summary && <div style={{ marginTop: 4, whiteSpace: 'pre-wrap' }}>{x.summary}</div>}
              </div>
            ))}
          </div>
        </section>
      )}
      {education.length > 0 && (
        <section style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 13, color: '#334155' }}>Education</div>
          <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
            {education.map((e, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div><strong>{e.degree || 'Degree'}</strong></div>
                <div style={{ color: '#64748b', fontSize: 13 }}>{e.year || ''}</div>
              </div>
            ))}
          </div>
        </section>
      )}
      {skills.length > 0 && (
        <section>
          <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 13, color: '#334155' }}>Skills</div>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {skills.filter(Boolean).map((s, i) => (
              <span key={i} style={{ background: '#e2e8f0', color: '#0f172a', padding: '4px 8px', borderRadius: 6, fontSize: 13 }}>{s}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}



