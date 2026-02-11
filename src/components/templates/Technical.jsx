export default function TechnicalTemplate({ data }) {
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
  const techStack = (data?.techStack && Array.isArray(data.techStack)) ? data.techStack : []
  return (
    <div style={{ fontFamily: 'Consolas, Menlo, monospace', color: '#0b0f19' }}>
      <div style={{ fontSize: 24, fontWeight: 800 }}>{personal.name || 'Your Name'} <span style={{ color: '#64748b', fontSize: 14 }}>— {personal.email || ''}</span></div>
      {(personal.phone || personal.location || links.github || links.linkedin || links.website) && (
        <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>
          {personal.phone && <span>{personal.phone}</span>}
          {personal.phone && personal.location && <span> • </span>}
          {personal.location && <span>{personal.location}</span>}
          {(personal.phone || personal.location) && (links.github || links.linkedin || links.website) && <span> • </span>}
          {links.github && <a href={links.github} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', marginRight: '6px' }}>GitHub</a>}
          {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', marginRight: '6px' }}>LinkedIn</a>}
          {links.website && <a href={links.website} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>Website</a>}
        </div>
      )}
      {summary && <div style={{ margin: '8px 0 12px' }}>{summary}</div>}
      {techStack.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>Tech Stack</div>
          <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {techStack.map((t, i) => (<span key={i} style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: 4 }}>{t}</span>))}
          </div>
        </div>
      )}
      <div style={{ display: 'grid', gap: 12 }}>
        {experience.map((x, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{x.role || 'Role'}</strong>
              <span style={{ color: '#64748b', fontSize: 12 }}>{x.period || ''}</span>
            </div>
            <div style={{ color: '#64748b', fontSize: 13 }}>{x.company || ''}</div>
            {x.location && <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{x.location}</div>}
            {x.responsibilities && (
              <div style={{ marginTop: 6, fontSize: 13 }}>
                <strong>Responsibilities:</strong>
                <div style={{ whiteSpace: 'pre-wrap', marginTop: 2 }}>{x.responsibilities}</div>
              </div>
            )}
            {x.achievements && (
              <div style={{ marginTop: 6, fontSize: 13 }}>
                <strong>Achievements:</strong>
                <div style={{ whiteSpace: 'pre-wrap', marginTop: 2 }}>{x.achievements}</div>
              </div>
            )}
            {x.points && Array.isArray(x.points) ? (
              <ul style={{ margin: '6px 0 0 16px' }}>
                {x.points.map((p, idx) => (<li key={idx}>{p}</li>))}
              </ul>
            ) : x.summary && !x.responsibilities && !x.achievements ? (
              <div style={{ marginTop: 4, whiteSpace: 'pre-wrap' }}>{x.summary}</div>
            ) : null}
          </div>
        ))}
      </div>
      {education.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>Education</div>
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div><strong>{e.degree || 'Degree'}</strong> {e.institution && <span>at {e.institution}</span>} <span style={{ color: '#64748b', fontSize: 12 }}>{e.year || ''}</span></div>
              {(e.startYear || e.endYear || e.gpa || e.coursework) && (
                <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>
                  {e.startYear && e.endYear && !e.year && <span>{e.startYear} - {e.endYear}</span>}
                  {e.gpa && <span>{e.startYear && e.endYear && !e.year ? ' • ' : ''}GPA: {e.gpa}</span>}
                  {e.coursework && <span> • Relevant Coursework: {e.coursework}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {skillItems.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>Skills</div>
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



