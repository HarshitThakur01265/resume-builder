export default function ClassicTemplate({ data }) {
  const personal = data?.personal || {}
  const links = data?.links || {}
  const summary = data?.summary || ''
  const education = Array.isArray(data?.education) ? data.education : []
  const experience = Array.isArray(data?.experience) ? data.experience : []
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
    <div style={{ fontFamily: 'Segoe UI, system-ui, sans-serif', color: 'black' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'bold' }}>{personal.name || 'Your Name'}</h2>
        <div style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>{personal.email || 'you@email.com'}</div>
        {(personal.phone || personal.location) && (
          <div style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>
            {personal.phone && <span>{personal.phone}</span>}
            {personal.phone && personal.location && <span> • </span>}
            {personal.location && <span>{personal.location}</span>}
          </div>
        )}
        {(links.github || links.linkedin || links.website) && (
          <div style={{ color: '#0066cc', fontSize: '13px', marginTop: '4px' }}>
            {links.github && <a href={links.github} target="_blank" rel="noreferrer" style={{ color: '#0066cc', textDecoration: 'none', marginRight: '8px' }}>GitHub</a>}
            {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ color: '#0066cc', textDecoration: 'none', marginRight: '8px' }}>LinkedIn</a>}
            {links.website && <a href={links.website} target="_blank" rel="noreferrer" style={{ color: '#0066cc', textDecoration: 'none' }}>Website</a>}
          </div>
        )}
      </div>

      {summary && (
        <section className="avoid-break" style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 'bold', borderBottom: '2px solid #333', paddingBottom: '4px' }}>Summary</h3>
          <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.4' }}>{summary}</div>
        </section>
      )}

      {experience.length > 0 && (
        <section className="avoid-break" style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 'bold', borderBottom: '2px solid #333', paddingBottom: '4px' }}>Experience</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {experience.map((x, idx) => (
              <div key={idx} className="avoid-break" style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <strong style={{ fontSize: '16px' }}>{x.role || 'Role'}</strong>
                    {x.company && <span style={{ color: '#666', fontSize: '14px', marginLeft: '4px' }}>@ {x.company}</span>}
                  </div>
                  {x.period && <span style={{ color: '#666', fontSize: '14px' }}>{x.period}</span>}
                </div>
                {(x.location || (x.startDate && x.endDate)) && (
                  <div style={{ color: '#666', fontSize: '13px', marginTop: '2px' }}>
                    {x.location && <span>{x.location}</span>}
                    {x.location && (x.startDate || x.endDate) && <span> • </span>}
                    {x.startDate && x.endDate && <span>{x.startDate} - {x.endDate}</span>}
                  </div>
                )}
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
                {x.summary && !x.responsibilities && !x.achievements && <div style={{ whiteSpace: 'pre-wrap', marginTop: '4px', fontSize: '14px', lineHeight: '1.4' }}>{x.summary}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="avoid-break" style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 'bold', borderBottom: '2px solid #333', paddingBottom: '4px' }}>Education</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {education.map((x, idx) => (
              <div key={idx} className="avoid-break" style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontSize: '16px' }}>
                    <strong>{x.degree || 'Degree'}</strong>
                    {x.institution && <span style={{ color: '#666', fontSize: '14px', marginLeft: '4px' }}>at {x.institution}</span>}
                  </div>
                  <span style={{ color: '#666', fontSize: '14px' }}>{x.year || ''}</span>
                </div>
                {(x.startYear || x.endYear || x.gpa || x.coursework || x.keyCourses || x.honors) && (
                  <div style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>
                    {x.startYear && x.endYear && !x.year && <div>{x.startYear} - {x.endYear}</div>}
                    {x.gpa && <div>GPA: {x.gpa}</div>}
                    {x.coursework && <div>Relevant Coursework: {x.coursework}</div>}
                    {x.keyCourses && <div>Key Courses: {x.keyCourses}</div>}
                    {x.honors && <div>Honors: {x.honors}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {skillItems.length > 0 && (
        <section className="avoid-break">
          <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 'bold', borderBottom: '2px solid #333', paddingBottom: '4px' }}>Skills</h3>
          <div style={{ fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            {skillItems.map((s, idx) => (
              <div key={idx} style={{ marginBottom: '4px' }}>{s}.</div>
            ))}
          </div>
        </section>
      )}

      {(data?.keyCourses || data?.honors) && (
        <section className="avoid-break" style={{ marginTop: '20px' }}>
          {data.keyCourses && (
            <div style={{ marginBottom: '12px' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 'bold', borderBottom: '2px solid #333', paddingBottom: '4px' }}>Key Courses</h3>
              <div style={{ fontSize: '14px', lineHeight: '1.4' }}>{data.keyCourses}</div>
            </div>
          )}
          {data.honors && (
            <div>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 'bold', borderBottom: '2px solid #333', paddingBottom: '4px' }}>Academic Honors</h3>
              <div style={{ fontSize: '14px', lineHeight: '1.4' }}>{data.honors}</div>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

