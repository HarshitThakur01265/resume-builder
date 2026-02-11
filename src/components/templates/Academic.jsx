export default function AcademicTemplate({ data }) {
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

  const LinkItem = ({ href, icon, label }) => (
    href ? (
      <a href={href} target="_blank" rel="noreferrer" style={{ color: '#0066cc', textDecoration: 'underline' }}>
        {icon} {label}
      </a>
    ) : null
  )

  const Section = ({ title, children }) => (
    <section className="avoid-break" style={{ marginTop: '20px' }}>
      <h3 style={{ margin: '0 0 12px', borderBottom: '2px solid #333', paddingBottom: '4px', fontSize: '18px', fontWeight: 'bold' }}>{title}</h3>
      {children}
    </section>
  )

  return (
    <div style={{ fontFamily: 'Segoe UI, system-ui, sans-serif', color: 'black' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>{personal.name || 'Your Name'}</div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', color: '#666', fontSize: '14px' }}>
          <LinkItem href={links.github} icon={'GitHub'} label={links.github?.replace(/^https?:\/\//,'') || ''} />
          <span>{links.github && (links.linkedin || links.website || personal.email || personal.phone || personal.location) ? '|' : ''}</span>
          <LinkItem href={links.linkedin} icon={'LinkedIn'} label={links.linkedin?.replace(/^https?:\/\//,'') || ''} />
          <span>{links.linkedin && (links.website || personal.email || personal.phone || personal.location) ? '|' : ''}</span>
          <LinkItem href={links.website} icon={'Web'} label={links.website?.replace(/^https?:\/\//,'') || ''} />
          <span>{(links.website || links.linkedin || links.github) && (personal.email || personal.phone || personal.location) ? '|' : ''}</span>
          {personal.email && <a href={`mailto:${personal.email}`} style={{ color: '#0066cc', textDecoration: 'underline' }}>Email</a>}
          {personal.phone && <span>{personal.email ? '| ' : ''}{personal.phone}</span>}
          {personal.location && <span>{(personal.email || personal.phone) ? '| ' : ''}{personal.location}</span>}
        </div>
      </div>

      {summary && (
        <Section title="Summary">
          <div style={{ whiteSpace: 'pre-wrap', color: '#333', fontSize: '14px', lineHeight: '1.4' }}>{summary}</div>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Work Experience">
          <div style={{ display: 'grid', gap: '16px' }}>
            {experience.map((x, i) => (
              <div key={i} className="avoid-break" style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '16px' }}>{x.role || 'Designation'}</strong>
                  <span style={{ color: '#666', fontSize: '14px' }}>{x.period || ''}</span>
                </div>
                <div style={{ color: '#666', fontSize: '14px', marginBottom: '6px' }}>{x.company || ''}</div>
                {x.location && <div style={{ color: '#666', fontSize: '13px', marginBottom: '4px' }}>{x.location}</div>}
                {x.responsibilities && (
                  <div style={{ marginTop: '6px', fontSize: '14px', lineHeight: '1.4' }}>
                    <strong>Responsibilities:</strong>
                    <div style={{ whiteSpace: 'pre-wrap', marginTop: '2px' }}>{x.responsibilities}</div>
                  </div>
                )}
                {x.achievements && (
                  <div style={{ marginTop: '6px', fontSize: '14px', lineHeight: '1.4' }}>
                    <strong>Achievements:</strong>
                    <div style={{ whiteSpace: 'pre-wrap', marginTop: '2px' }}>{x.achievements}</div>
                  </div>
                )}
                {x.points && Array.isArray(x.points) && x.points.length > 0 ? (
                  <ul style={{ margin: '6px 0 0 16px', fontSize: '14px', lineHeight: '1.4' }}>
                    {x.points.map((p, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{p}</li>
                    ))}
                  </ul>
                ) : (
                  x.summary && !x.responsibilities && !x.achievements && <div style={{ marginTop: '6px', whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.4' }}>{x.summary}</div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          <div style={{ display: 'grid', gap: '12px' }}>
            {education.map((e, i) => (
              <div key={i} className="avoid-break" style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontSize: '16px' }}>
                    <strong>{e.degree || 'Degree'}</strong> {e.institution && <span>at {e.institution}</span>}
                  </div>
                  <div style={{ color: '#666', fontSize: '14px' }}>{e.year || ''}</div>
                </div>
                {(e.startYear || e.endYear || e.gpa || e.coursework || e.keyCourses || e.honors) && (
                  <div style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>
                    {e.startYear && e.endYear && !e.year && <div>{e.startYear} - {e.endYear}</div>}
                    {e.gpa && <div>GPA: {e.gpa}</div>}
                    {e.coursework && <div>Relevant Coursework: {e.coursework}</div>}
                    {e.keyCourses && <div>Key Courses: {e.keyCourses}</div>}
                    {e.honors && <div>Honors: {e.honors}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {skillItems.length > 0 && (
        <Section title="Skills">
          <div style={{ fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            {skillItems.map((s, i) => (
              <div key={i} style={{ marginBottom: '4px' }}>{s}.</div>
            ))}
          </div>
        </Section>
      )}

      {(data?.keyCourses || data?.honors) && (
        <Section title={data.keyCourses && data.honors ? "Academic Details" : data.keyCourses ? "Key Courses" : "Academic Honors"}>
          {data.keyCourses && (
            <div style={{ marginBottom: '8px', fontSize: '14px', lineHeight: '1.4' }}>
              <strong>Key Courses:</strong> {data.keyCourses}
            </div>
          )}
          {data.honors && (
            <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
              <strong>Academic Honors:</strong> {data.honors}
            </div>
          )}
        </Section>
      )}

      <div style={{ textAlign: 'center', color: '#666', marginTop: '30px', fontSize: '12px' }}>
        Last updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  )
}

