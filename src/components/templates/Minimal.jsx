export default function MinimalTemplate({ data }) {
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
    <div style={{ fontFamily: 'system-ui, sans-serif', color: '#111', lineHeight: 1.5 }}>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{personal.name || 'Your Name'}</div>
      <div style={{ color: '#555', fontSize: 13, marginBottom: 4 }}>{personal.email || ''}</div>
      {(personal.phone || personal.location) && (
        <div style={{ color: '#555', fontSize: 12, marginBottom: 4 }}>
          {personal.phone && <span>{personal.phone}</span>}
          {personal.phone && personal.location && <span> • </span>}
          {personal.location && <span>{personal.location}</span>}
        </div>
      )}
      {(links.github || links.linkedin || links.website) && (
        <div style={{ color: '#0066cc', fontSize: 12, marginBottom: 10 }}>
          {links.github && <a href={links.github} target="_blank" rel="noreferrer" style={{ color: '#0066cc', textDecoration: 'none', marginRight: '6px' }}>GitHub</a>}
          {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ color: '#0066cc', textDecoration: 'none', marginRight: '6px' }}>LinkedIn</a>}
          {links.website && <a href={links.website} target="_blank" rel="noreferrer" style={{ color: '#0066cc', textDecoration: 'none' }}>Website</a>}
        </div>
      )}
      {summary && <div style={{ marginBottom: 14 }}>{summary}</div>}
      {experience.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Experience</div>
          {experience.map((x, i) => (
            <div key={i} style={{ marginTop: 6 }}>
              <div><strong>{x.role || 'Role'}</strong> {x.company ? `@ ${x.company}` : ''} {x.period && `• ${x.period}`}</div>
              {x.location && <div style={{ color: '#555', fontSize: 12, marginTop: 2 }}>{x.location}</div>}
              {x.responsibilities && (
                <div style={{ marginTop: 4, fontSize: 13 }}>
                  <strong>Responsibilities:</strong>
                  <div style={{ whiteSpace: 'pre-wrap', marginTop: 2, color: '#333' }}>{x.responsibilities}</div>
                </div>
              )}
              {x.achievements && (
                <div style={{ marginTop: 4, fontSize: 13 }}>
                  <strong>Achievements:</strong>
                  <div style={{ whiteSpace: 'pre-wrap', marginTop: 2, color: '#333' }}>{x.achievements}</div>
                </div>
              )}
              {x.summary && !x.responsibilities && !x.achievements && <div style={{ whiteSpace: 'pre-wrap', color: '#333', marginTop: 4 }}>{x.summary}</div>}
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Education</div>
          {education.map((e, i) => (
            <div key={i} style={{ marginTop: 6 }}>
              <div><strong>{e.degree || 'Degree'}</strong> {e.institution && `at ${e.institution}`} {e.year ? `• ${e.year}` : ''}</div>
              {(e.startYear || e.endYear || e.gpa || e.coursework || e.keyCourses || e.honors) && (
                <div style={{ color: '#555', fontSize: 12, marginTop: 2 }}>
                  {e.startYear && e.endYear && !e.year && <span>{e.startYear} - {e.endYear}</span>}
                  {e.gpa && <span>{e.startYear && e.endYear && !e.year ? ' • ' : ''}GPA: {e.gpa}</span>}
                  {e.coursework && <span> • {e.coursework}</span>}
                  {e.keyCourses && <span> • {e.keyCourses}</span>}
                  {e.honors && <span> • {e.honors}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {skillItems.length > 0 && (
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Skills</div>
          <div style={{ marginTop: 6, fontSize: 13, lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            {skillItems.map((s, i) => (
              <div key={i} style={{ marginBottom: '4px' }}>{s}.</div>
            ))}
          </div>
        </div>
      )}
      {(data?.keyCourses || data?.honors) && (
        <div style={{ marginTop: 12 }}>
          {data.keyCourses && (
            <div style={{ marginBottom: 6 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Key Courses</div>
              <div style={{ fontSize: 13, marginTop: 2 }}>{data.keyCourses}</div>
            </div>
          )}
          {data.honors && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Academic Honors</div>
              <div style={{ fontSize: 13, marginTop: 2 }}>{data.honors}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}



