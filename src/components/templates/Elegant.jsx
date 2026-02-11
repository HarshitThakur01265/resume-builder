export default function ElegantTemplate({ data }) {
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
    <div style={{ fontFamily: 'Georgia, serif', color: '#111827' }}>
      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 28, fontWeight: 700 }}>{personal.name || 'Your Name'}</div>
        <div style={{ color: '#6b7280', fontSize: 13 }}>{personal.email || ''}</div>
        {(personal.phone || personal.location) && (
          <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>
            {personal.phone && <span>{personal.phone}</span>}
            {personal.phone && personal.location && <span> • </span>}
            {personal.location && <span>{personal.location}</span>}
          </div>
        )}
        {(links.github || links.linkedin || links.website) && (
          <div style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>
            {links.github && <a href={links.github} target="_blank" rel="noreferrer" style={{ color: '#6b7280', textDecoration: 'underline', marginRight: '8px' }}>GitHub</a>}
            {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ color: '#6b7280', textDecoration: 'underline', marginRight: '8px' }}>LinkedIn</a>}
            {links.website && <a href={links.website} target="_blank" rel="noreferrer" style={{ color: '#6b7280', textDecoration: 'underline' }}>Website</a>}
          </div>
        )}
      </div>
      {summary && <div style={{ marginBottom: 10, textAlign: 'center' }}>{summary}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Experience</div>
          {experience.map((x, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{x.role || 'Role'}</strong>
                <span style={{ color: '#6b7280', fontSize: 12 }}>{x.period || ''}</span>
              </div>
              <div style={{ color: '#6b7280' }}>{x.company || ''}</div>
              {x.location && <div style={{ color: '#6b7280', fontSize: 11, marginTop: 2 }}>{x.location}</div>}
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
              {x.summary && !x.responsibilities && !x.achievements && <div style={{ marginTop: 4, whiteSpace: 'pre-wrap', fontSize: 13 }}>{x.summary}</div>}
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Education</div>
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{e.degree || 'Degree'}</strong>
                <span style={{ color: '#6b7280', fontSize: 12 }}>{e.year || ''}</span>
              </div>
              {e.institution && <div style={{ color: '#6b7280', fontSize: 11, marginTop: 2 }}>{e.institution}</div>}
              {(e.startYear || e.endYear || e.gpa || e.coursework) && (
                <div style={{ color: '#6b7280', fontSize: 11, marginTop: 2 }}>
                  {e.startYear && e.endYear && !e.year && <span>{e.startYear} - {e.endYear}</span>}
                  {e.gpa && <span>{e.startYear && e.endYear && !e.year ? ' • ' : ''}GPA: {e.gpa}</span>}
                  {e.coursework && <span> • {e.coursework}</span>}
                </div>
              )}
            </div>
          ))}
          <div style={{ fontWeight: 700, fontSize: 14, marginTop: 10, marginBottom: 6 }}>Skills</div>
          <div style={{ fontSize: 13, lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            {skillItems.map((s, i) => (
              <div key={i} style={{ marginBottom: '4px' }}>{s}.</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}




