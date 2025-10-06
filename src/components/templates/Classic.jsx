export default function ClassicTemplate({ data }) {
  const personal = data?.personal || {}
  const education = Array.isArray(data?.education) ? data.education : []
  const experience = Array.isArray(data?.experience) ? data.experience : []
  const skills = Array.isArray(data?.skills) ? data.skills : []

  return (
    <div style={{ fontFamily: 'Segoe UI, system-ui, sans-serif', color: 'black' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{personal.name || 'Your Name'}</h2>
        <div style={{ color: '#666', fontSize: '14px' }}>{personal.email || 'you@email.com'}</div>
      </div>

      {experience.length > 0 && (
        <section className="avoid-break" style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 'bold', borderBottom: '2px solid #333', paddingBottom: '4px' }}>Experience</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {experience.map((x, idx) => (
              <div key={idx} className="avoid-break" style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '16px' }}>{x.role || 'Role'}</strong>
                  <span style={{ color: '#666', fontSize: '14px' }}>@ {x.company || 'Company'}</span>
                </div>
                {x.summary && <div style={{ whiteSpace: 'pre-wrap', marginTop: '4px', fontSize: '14px', lineHeight: '1.4' }}>{x.summary}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="avoid-break" style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 'bold', borderBottom: '2px solid #333', paddingBottom: '4px' }}>Education</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {education.map((x, idx) => (
              <div key={idx} className="avoid-break" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '16px' }}>{x.degree || 'Degree'}</strong>
                <span style={{ color: '#666', fontSize: '14px' }}>{x.year || ''}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section className="avoid-break">
          <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 'bold', borderBottom: '2px solid #333', paddingBottom: '4px' }}>Skills</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {skills.filter(Boolean).map((s, idx) => (
              <span key={idx} style={{ background: '#f0f0f0', color: '#333', padding: '4px 8px', borderRadius: '4px', fontSize: '14px', border: '1px solid #ddd' }}>{s}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

