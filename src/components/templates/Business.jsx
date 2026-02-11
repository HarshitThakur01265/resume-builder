export default function BusinessTemplate({ data }) {
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
    <div style={{ fontFamily: 'Georgia, system-ui, serif', color: '#111827' }}>
      <div style={{ textAlign: 'center', borderBottom: '2px solid #111827', paddingBottom: 6, marginBottom: 10 }}>
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
          <div style={{ color: '#3b82f6', fontSize: 12, marginTop: 4 }}>
            {links.github && <a href={links.github} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', marginRight: '8px' }}>GitHub</a>}
            {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', marginRight: '8px' }}>LinkedIn</a>}
            {links.website && <a href={links.website} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>Website</a>}
          </div>
        )}
      </div>
      {summary && <div style={{ marginBottom: 10 }}>{summary}</div>}
      {experience.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontWeight: 700 }}>Experience</div>
          {experience.map((x, i) => (
            <div key={i} style={{ marginTop: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{x.role || 'Role'}</strong>
                <span style={{ color: '#6b7280', fontSize: 13 }}>{x.period || ''}</span>
              </div>
              <div style={{ color: '#6b7280' }}>{x.company || ''}</div>
              {x.location && <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>{x.location}</div>}
              {x.responsibilities && (
                <div style={{ marginTop: 4, fontSize: 13 }}>
                  <strong>Responsibilities:</strong>
                  <div style={{ whiteSpace: 'pre-wrap', marginTop: 2 }}>{x.responsibilities}</div>
                </div>
              )}
              {x.achievements && (
                <div style={{ marginTop: 4, fontSize: 13 }}>
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
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontWeight: 700 }}>Education</div>
          {education.map((e, i) => (
            <div key={i} style={{ marginTop: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{e.degree || 'Degree'}</strong>
                <span style={{ color: '#6b7280', fontSize: 13 }}>{e.year || ''}</span>
              </div>
              {e.institution && <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>{e.institution}</div>}
              {(e.startYear || e.endYear || e.gpa || e.coursework) && (
                <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>
                  {e.startYear && e.endYear && !e.year && <span>{e.startYear} - {e.endYear}</span>}
                  {e.gpa && <span>{e.startYear && e.endYear && !e.year ? ' • ' : ''}GPA: {e.gpa}</span>}
                  {e.coursework && <div style={{ marginTop: 2 }}>Relevant Coursework: {e.coursework}</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div>
          <div style={{ fontWeight: 700 }}>Skills</div>
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



