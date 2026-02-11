export default function ATSTemplate({ data }) {
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
    <div style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: '#000' }}>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{personal.name || 'Your Name'}</div>
      <div style={{ fontSize: 12, color: '#333', marginBottom: 4 }}>{personal.email || ''}</div>
      {(personal.phone || personal.location) && (
        <div style={{ fontSize: 11, color: '#333', marginBottom: 4 }}>
          {personal.phone && <span>{personal.phone}</span>}
          {personal.phone && personal.location && <span> • </span>}
          {personal.location && <span>{personal.location}</span>}
        </div>
      )}
      {(links.github || links.linkedin || links.website) && (
        <div style={{ fontSize: 11, color: '#0066cc', marginBottom: 8 }}>
          {links.github && <a href={links.github} target="_blank" rel="noreferrer" style={{ color: '#0066cc', textDecoration: 'none', marginRight: '8px' }}>GitHub</a>}
          {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ color: '#0066cc', textDecoration: 'none', marginRight: '8px' }}>LinkedIn</a>}
          {links.website && <a href={links.website} target="_blank" rel="noreferrer" style={{ color: '#0066cc', textDecoration: 'none' }}>Website</a>}
        </div>
      )}
      {summary && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 700 }}>Summary</div>
          <div style={{ marginTop: 4 }}>{summary}</div>
        </div>
      )}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontWeight: 700 }}>Experience</div>
        {experience.map((x, i) => (
          <div key={i} style={{ marginTop: 6 }}>
            <div><strong>{x.role || 'Role'}</strong> — {x.company || ''} {x.period && `(${x.period})`}</div>
            {x.location && <div style={{ fontSize: 11, color: '#333', marginTop: 2 }}>{x.location}</div>}
            {x.responsibilities && (
              <div style={{ marginTop: 4, fontSize: 12 }}>
                <strong>Responsibilities:</strong> {x.responsibilities}
              </div>
            )}
            {x.achievements && (
              <div style={{ marginTop: 4, fontSize: 12 }}>
                <strong>Achievements:</strong> {x.achievements}
              </div>
            )}
            {x.summary && !x.responsibilities && !x.achievements && <div style={{ marginTop: 4, whiteSpace: 'pre-wrap', fontSize: 12 }}>{x.summary}</div>}
          </div>
        ))}
      </div>
      {education.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 700 }}>Education</div>
          {education.map((e, i) => (
            <div key={i} style={{ marginTop: 4 }}>
              <div><strong>{e.degree || 'Degree'}</strong> {e.institution && `— ${e.institution}`} {e.year && `— ${e.year}`}</div>
              {(e.startYear || e.endYear || e.gpa || e.coursework) && (
                <div style={{ fontSize: 11, color: '#333', marginTop: 2 }}>
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
        <div>
          <div style={{ fontWeight: 700 }}>Skills</div>
          <div style={{ marginTop: 4, fontSize: 13, lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            {skillItems.map((s, i) => (
              <div key={i} style={{ marginBottom: '4px' }}>{s}.</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}








