export default function InfographicTemplate({ data }) {
  const personal = data?.personal || {}
  const links = data?.links || {}
  const summary = data?.summary || ''
  const experience = Array.isArray(data?.experience) ? data.experience : []
  const education = Array.isArray(data?.education) ? data.education : []
  const skills = Array.isArray(data?.skills) ? data.skills : []
  const skillItems = skills
    .filter(Boolean)
    .flatMap(s =>
      String(s)
        .split('.')
        .map(t => t.trim())
        .filter(Boolean)
    )
  return (
    <div style={{ fontFamily: '"DM Sans", system-ui, sans-serif', color: '#0f172a' }}>
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: '#10b981' }} />
          <div style={{ fontSize: 24, fontWeight: 800 }}>{personal.name || 'Your Name'}</div>
        </div>
        <div style={{ color: '#64748b', fontSize: 12, marginLeft: 22 }}>{personal.email || ''}</div>
        {(personal.phone || personal.location) && (
          <div style={{ color: '#64748b', fontSize: 11, marginLeft: 22, marginTop: 2 }}>
            {personal.phone && <span>{personal.phone}</span>}
            {personal.phone && personal.location && <span> • </span>}
            {personal.location && <span>{personal.location}</span>}
          </div>
        )}
        {(links.github || links.linkedin || links.website) && (
          <div style={{ color: '#10b981', fontSize: 11, marginLeft: 22, marginTop: 4 }}>
            {links.github && <a href={links.github} target="_blank" rel="noreferrer" style={{ color: '#10b981', textDecoration: 'none', marginRight: '6px' }}>GitHub</a>}
            {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ color: '#10b981', textDecoration: 'none', marginRight: '6px' }}>LinkedIn</a>}
            {links.website && <a href={links.website} target="_blank" rel="noreferrer" style={{ color: '#10b981', textDecoration: 'none' }}>Website</a>}
          </div>
        )}
      </div>
      {summary && <div style={{ marginBottom: 10, fontSize: 13, lineHeight: 1.5 }}>{summary}</div>}
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
              {x.location && <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>{x.location}</div>}
              {x.responsibilities && <div style={{ fontSize: 11, marginTop: 2, color: '#64748b' }}>Responsibilities: {x.responsibilities.substring(0, 50)}...</div>}
              {x.achievements && <div style={{ fontSize: 11, marginTop: 2, color: '#64748b' }}>Achievements: {x.achievements.substring(0, 50)}...</div>}
            </div>
          ))}
          {education.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: '#10b981' }}>Education</div>
              {education.map((e, i) => (
                <div key={i} style={{ marginTop: 6 }}>
                  <div><strong>{e.degree || 'Degree'}</strong> {e.institution && <span style={{ fontSize: 11 }}>at {e.institution}</span>}</div>
                  <div style={{ color: '#64748b', fontSize: 11 }}>{e.year || ''}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 13, color: '#10b981' }}>Skills</div>
          <div style={{ marginTop: 6, fontSize: 13, lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            {skillItems.map((s, i) => (
              <div key={i} style={{ marginBottom: '4px' }}>{s}.</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}








