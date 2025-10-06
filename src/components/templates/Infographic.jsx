export default function InfographicTemplate({ data }) {
  const personal = data?.personal || {}
  const experience = Array.isArray(data?.experience) ? data.experience : []
  const skills = Array.isArray(data?.skills) ? data.skills : []
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#0f172a' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: 999, background: '#10b981' }} />
        <div style={{ fontSize: 24, fontWeight: 800 }}>{personal.name || 'Your Name'}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 13, color: '#10b981' }}>Experience</div>
          {experience.map((x, i) => (
            <div key={i} style={{ marginTop: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{x.role || 'Role'}</strong>
                <span style={{ color: '#64748b', fontSize: 12 }}>{x.period || ''}</span>
              </div>
              <div style={{ color: '#64748b', fontSize: 13 }}>{x.company || ''}</div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 13, color: '#10b981' }}>Skills</div>
          <div style={{ marginTop: 6, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {skills.filter(Boolean).map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 60, height: 6, background: '#e2e8f0', borderRadius: 999 }}>
                  <div style={{ width: '70%', height: '100%', background: '#10b981', borderRadius: 999 }} />
                </div>
                <span style={{ fontSize: 12 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}








