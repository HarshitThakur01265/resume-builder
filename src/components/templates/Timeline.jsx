export default function TimelineTemplate({ data }) {
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
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#0f172a' }}>
      <div style={{ fontSize: 26, fontWeight: 800 }}>{personal.name || 'Your Name'}</div>
      <div style={{ color: '#64748b', fontSize: 13 }}>{personal.email || ''}</div>
      {(personal.phone || personal.location) && (
        <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>
          {personal.phone && <span>{personal.phone}</span>}
          {personal.phone && personal.location && <span> • </span>}
          {personal.location && <span>{personal.location}</span>}
        </div>
      )}
      {(links.github || links.linkedin || links.website) && (
        <div style={{ color: '#3b82f6', fontSize: 12, marginTop: 4 }}>
          {links.github && <a href={links.github} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', marginRight: '8px' }}>GitHub</a>}
          {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', marginRight: '8px' }}>LinkedIn</a>}
          {links.website && <a href={links.website} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>Website</a>}
        </div>
      )}
      {summary && <div style={{ margin: '8px 0 12px' }}>{summary}</div>}
      {experience.length > 0 && (
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
              {x.location && <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>{x.location}</div>}
              {x.responsibilities && (
                <div style={{ marginTop: 4, fontSize: 12 }}>
                  <strong>Responsibilities:</strong>
                  <div style={{ whiteSpace: 'pre-wrap', marginTop: 2 }}>{x.responsibilities}</div>
                </div>
              )}
              {x.achievements && (
                <div style={{ marginTop: 4, fontSize: 12 }}>
                  <strong>Achievements:</strong>
                  <div style={{ whiteSpace: 'pre-wrap', marginTop: 2 }}>{x.achievements}</div>
                </div>
              )}
              {x.summary && !x.responsibilities && !x.achievements && <div style={{ whiteSpace: 'pre-wrap', marginTop: 4 }}>{x.summary}</div>}
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 800, fontSize: 13 }}>Education</div>
          {education.map((e, i) => (
            <div key={i} style={{ marginTop: 6 }}>
              <div><strong>{e.degree || 'Degree'}</strong> {e.institution && <span>at {e.institution}</span>} <span style={{ color: '#64748b', fontSize: 12 }}>{e.year || ''}</span></div>
              {(e.startYear || e.endYear || e.gpa || e.coursework) && (
                <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>
                  {e.startYear && e.endYear && !e.year && <span>{e.startYear} - {e.endYear}</span>}
                  {e.gpa && <span>{e.startYear && e.endYear && !e.year ? ' • ' : ''}GPA: {e.gpa}</span>}
                  {e.coursework && <span> • {e.coursework}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 800, fontSize: 13 }}>Skills</div>
          <div style={{ marginTop: 6, fontSize: 13, lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            {skillItems.map((s, i) => (
              <div key={i} style={{ marginBottom: '4px' }}>{s}.</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}











