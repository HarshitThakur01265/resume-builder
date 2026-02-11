export default function SidebarTemplate({ data }) {
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
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#111', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
      <div style={{ background: '#f1f5f9', borderRadius: 8, padding: 12 }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>{personal.name || 'Your Name'}</div>
        <div style={{ color: '#64748b', fontSize: 13 }}>{personal.email || ''}</div>
        {(personal.phone || personal.location) && (
          <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>
            {personal.phone && <div>{personal.phone}</div>}
            {personal.location && <div>{personal.location}</div>}
          </div>
        )}
        {(links.github || links.linkedin || links.website) && (
          <div style={{ marginTop: 6, fontSize: 12 }}>
            {links.github && <a href={links.github} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', display: 'block', marginBottom: 2 }}>GitHub</a>}
            {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', display: 'block', marginBottom: 2 }}>LinkedIn</a>}
            {links.website && <a href={links.website} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', display: 'block' }}>Website</a>}
          </div>
        )}
        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>Skills</div>
          <div style={{ marginTop: 6, fontSize: 13, lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            {skillItems.map((s, i) => (
              <div key={i} style={{ marginBottom: '4px' }}>{s}.</div>
            ))}
          </div>
        </div>
        {education.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>Education</div>
            {education.map((e, i) => (
              <div key={i} style={{ marginTop: 4 }}>
                <div><strong>{e.degree || 'Degree'}</strong> <span style={{ color: '#64748b', fontSize: 12 }}>{e.year || ''}</span></div>
                {e.institution && <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>{e.institution}</div>}
                {(e.startYear || e.endYear || e.gpa) && (
                  <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>
                    {e.startYear && e.endYear && !e.year && <span>{e.startYear} - {e.endYear}</span>}
                    {e.gpa && <span>{e.startYear && e.endYear && !e.year ? ' • ' : ''}GPA: {e.gpa}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        {summary && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Summary</div>
            <div style={{ marginTop: 4 }}>{summary}</div>
          </div>
        )}
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Experience</div>
          {experience.map((x, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{x.role || 'Role'}</strong>
                <span style={{ color: '#64748b', fontSize: 12 }}>{x.period || ''}</span>
              </div>
              <div style={{ color: '#64748b', fontSize: 13 }}>{x.company || ''}</div>
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
              {x.summary && !x.responsibilities && !x.achievements && <div style={{ marginTop: 4, whiteSpace: 'pre-wrap', fontSize: 13 }}>{x.summary}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}




