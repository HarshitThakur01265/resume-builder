export default function CreativeTemplate({ data }) {
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
    <div style={{ fontFamily: 'Poppins, system-ui, sans-serif', color: '#111827' }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <div style={{ width: 8, height: 32, background: '#3b82f6', borderRadius: 4 }} />
          <div style={{ fontSize: 26, fontWeight: 800 }}>{personal.name || 'Your Name'}</div>
        </div>
        <div style={{ color: '#6b7280', fontSize: 13, marginLeft: 20 }}>{personal.email || ''}</div>
        {(personal.phone || personal.location) && (
          <div style={{ color: '#6b7280', fontSize: 12, marginLeft: 20, marginTop: 2 }}>
            {personal.phone && <span>{personal.phone}</span>}
            {personal.phone && personal.location && <span> • </span>}
            {personal.location && <span>{personal.location}</span>}
          </div>
        )}
        {(links.github || links.linkedin || links.website) && (
          <div style={{ color: '#2563eb', fontSize: 12, marginLeft: 20, marginTop: 4 }}>
            {links.github && <a href={links.github} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none', marginRight: '8px' }}>Portfolio/Behance</a>}
            {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none', marginRight: '8px' }}>LinkedIn</a>}
            {links.website && <a href={links.website} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>Website</a>}
          </div>
        )}
      </div>
      {summary && <div style={{ marginBottom: 12 }}>{summary}</div>}
      {experience.length > 0 && (
        <section style={{ marginBottom: 12 }}>
          <div style={{ color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}>Experience</div>
          <div style={{ marginTop: 6, display: 'grid', gap: 8 }}>
            {experience.map((x, i) => (
              <div key={i} style={{ borderLeft: '3px solid #93c5fd', paddingLeft: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{x.role || 'Role'}</strong>
                  <span style={{ color: '#6b7280', fontSize: 13 }}>{x.period || ''}</span>
                </div>
                <div style={{ color: '#6b7280', fontSize: 14 }}>{x.company || ''}</div>
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
        </section>
      )}
      {education.length > 0 && (
        <section style={{ marginBottom: 12 }}>
          <div style={{ color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}>Education</div>
          <div style={{ marginTop: 6, display: 'grid', gap: 6 }}>
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div><strong>{e.degree || 'Degree'}</strong> {e.institution && <span style={{ fontSize: 12, color: '#6b7280' }}>at {e.institution}</span>}</div>
                  <div style={{ color: '#6b7280', fontSize: 13 }}>{e.year || ''}</div>
                </div>
                {(e.startYear || e.endYear || e.gpa) && (
                  <div style={{ color: '#6b7280', fontSize: 11, marginTop: 2 }}>
                    {e.startYear && e.endYear && !e.year && <span>{e.startYear} - {e.endYear}</span>}
                    {e.gpa && <span>{e.startYear && e.endYear && !e.year ? ' • ' : ''}GPA: {e.gpa}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      {skills.length > 0 && (
        <section>
          <div style={{ color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}>Skills</div>
          <div style={{ marginTop: 6, fontSize: 13, lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            {skillItems.map((s, i) => (
              <div key={i} style={{ marginBottom: '4px' }}>{s}.</div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}



