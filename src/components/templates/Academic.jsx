export default function AcademicTemplate({ data }) {
  const personal = data?.personal || {}
  const links = data?.links || {}
  const summary = data?.summary || ''
  const experience = Array.isArray(data?.experience) ? data.experience : []
  const education = Array.isArray(data?.education) ? data.education : []
  const skills = Array.isArray(data?.skills) ? data.skills : []

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
          <span>{links.github && (links.linkedin || links.website || personal.email || personal.phone) ? '|' : ''}</span>
          <LinkItem href={links.linkedin} icon={'LinkedIn'} label={links.linkedin?.replace(/^https?:\/\//,'') || ''} />
          <span>{links.linkedin && (links.website || personal.email || personal.phone) ? '|' : ''}</span>
          <LinkItem href={links.website} icon={'Web'} label={links.website?.replace(/^https?:\/\//,'') || ''} />
          <span>{(links.website || links.linkedin || links.github) && (personal.email || personal.phone) ? '|' : ''}</span>
          {personal.email && <a href={`mailto:${personal.email}`} style={{ color: '#0066cc', textDecoration: 'underline' }}>Email</a>}
          {personal.phone && <span>| {personal.phone}</span>}
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
                {x.points && Array.isArray(x.points) && x.points.length > 0 ? (
                  <ul style={{ margin: '6px 0 0 16px', fontSize: '14px', lineHeight: '1.4' }}>
                    {x.points.map((p, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{p}</li>
                    ))}
                  </ul>
                ) : (
                  x.summary && <div style={{ marginTop: '6px', whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.4' }}>{x.summary}</div>
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
              <div key={i} className="avoid-break" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: '16px' }}>
                  <strong>{e.degree || 'Degree'}</strong> at {e.institution || 'University'}
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>{e.year || ''}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {skills.filter(Boolean).map((s, i) => (
              <span key={i} style={{ background: '#f0f0f0', color: '#333', padding: '4px 8px', borderRadius: '4px', fontSize: '14px', border: '1px solid #ddd' }}>{s}</span>
            ))}
          </div>
        </Section>
      )}

      <div style={{ textAlign: 'center', color: '#666', marginTop: '30px', fontSize: '12px' }}>
        Last updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  )
}

