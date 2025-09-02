export default function AcademicTemplate({ data }) {
  const personal = data?.personal || {}
  const links = data?.links || {}
  const summary = data?.summary || ''
  const experience = Array.isArray(data?.experience) ? data.experience : []
  const education = Array.isArray(data?.education) ? data.education : []
  const skills = Array.isArray(data?.skills) ? data.skills : []

  const LinkItem = ({ href, icon, label }) => (
    href ? (
      <a href={href} target="_blank" rel="noreferrer" style={{ color: '#93c5fd', textDecoration: 'none' }}>
        {icon} {label}
      </a>
    ) : null
  )

  const Section = ({ title, children }) => (
    <section style={{ marginTop: 18 }}>
      <h3 style={{ margin: '0 0 8px', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: 4 }}>{title}</h3>
      {children}
    </section>
  )

  return (
    <div style={{ fontFamily: 'Segoe UI, system-ui, sans-serif', color: '#e2e8f0' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 28, fontWeight: 700 }}>{personal.name || 'Your Name'}</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', color: '#94a3b8' }}>
          <LinkItem href={links.github} icon={'GitHub'} label={links.github?.replace(/^https?:\/\//,'') || ''} />
          <span>{links.github && (links.linkedin || links.website || personal.email || personal.phone) ? '|' : ''}</span>
          <LinkItem href={links.linkedin} icon={'LinkedIn'} label={links.linkedin?.replace(/^https?:\/\//,'') || ''} />
          <span>{links.linkedin && (links.website || personal.email || personal.phone) ? '|' : ''}</span>
          <LinkItem href={links.website} icon={'Web'} label={links.website?.replace(/^https?:\/\//,'') || ''} />
          <span>{(links.website || links.linkedin || links.github) && (personal.email || personal.phone) ? '|' : ''}</span>
          {personal.email && <a href={`mailto:${personal.email}`} style={{ color: '#93c5fd', textDecoration: 'none' }}>Email</a>}
          {personal.phone && <span>| {personal.phone}</span>}
        </div>
      </div>

      {summary && (
        <Section title="Summary">
          <div style={{ whiteSpace: 'pre-wrap', color: '#cbd5e1' }}>{summary}</div>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Work Experience">
          <div style={{ display: 'grid', gap: 12 }}>
            {experience.map((x, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{x.role || 'Designation'}</strong>
                  <span style={{ color: '#94a3b8' }}>{x.period || ''}</span>
                </div>
                <div style={{ color: '#94a3b8' }}>{x.company || ''}</div>
                {x.points && Array.isArray(x.points) && x.points.length > 0 ? (
                  <ul style={{ margin: '6px 0 0 16px' }}>
                    {x.points.map((p, idx) => (
                      <li key={idx} style={{ marginBottom: 4 }}>{p}</li>
                    ))}
                  </ul>
                ) : (
                  x.summary && <div style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>{x.summary}</div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          <div style={{ display: 'grid', gap: 8 }}>
            {education.map((e, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>{e.degree || 'Degree'}</strong> at {e.institution || 'University'}
                </div>
                <div style={{ color: '#94a3b8' }}>{e.year || ''}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {skills.filter(Boolean).map((s, i) => (
              <span key={i} style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 8px', borderRadius: 6 }}>{s}</span>
            ))}
          </div>
        </Section>
      )}

      <div style={{ textAlign: 'center', color: '#64748b', marginTop: 24, fontSize: 12 }}>
        Last updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  )
}

