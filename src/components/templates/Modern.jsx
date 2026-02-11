export default function ModernTemplate({ data }) {
  const personal = data?.personal || {}
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

  const avatarUrl = personal.photo || 'https://avatars.githubusercontent.com/u/9919?s=200&v=4'

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#0f172a', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20 }}>
      {/* Sidebar */}
      <aside style={{
        background: 'linear-gradient(180deg, rgba(96,165,250,0.12), rgba(147,51,234,0.12))',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: 16
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <img src={avatarUrl} alt="Profile" style={{ width: 84, height: 84, borderRadius: '50%', objectFit: 'cover', border: '3px solid #60a5fa' }} />
          <div style={{ fontSize: 18, fontWeight: 800, textAlign: 'center' }}>{personal.name || 'Your Name'}</div>
          <div style={{ color: '#475569', fontSize: 13, textAlign: 'center', wordBreak: 'break-word' }}>{personal.email || 'you@email.com'}</div>
          {(data?.links?.github || data?.links?.linkedin || data?.links?.website) && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', fontSize: 12 }}>
              {data.links.github && <a href={data.links.github} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', textDecoration: 'none' }}>GitHub</a>}
              {data.links.linkedin && <a href={data.links.linkedin} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', textDecoration: 'none' }}>LinkedIn</a>}
              {data.links.website && <a href={data.links.website} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', textDecoration: 'none' }}>Website</a>}
            </div>
          )}
        </div>

        {skillItems.length > 0 && (
          <section style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 12, color: '#334155' }}>Skills</div>
            <div style={{ marginTop: 10, fontSize: 13, color: '#0f172a', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
              {skillItems.map((s, i) => (
                <div key={i} style={{ marginBottom: '4px' }}>{s}.</div>
              ))}
            </div>
          </section>
        )}

        {(personal.location || personal.phone) && (
          <section style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 12, color: '#334155' }}>Contact</div>
            <div style={{ marginTop: 8, display: 'grid', gap: 6, fontSize: 13 }}>
              {personal.location && <div>{personal.location}</div>}
              {personal.phone && <div>{personal.phone}</div>}
            </div>
          </section>
        )}
      </aside>

      {/* Main content */}
      <div>
        {summary && (
          <section style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 12, color: '#334155' }}>Summary</div>
            <div style={{ marginTop: 8, lineHeight: 1.6 }}>{summary}</div>
          </section>
        )}

        {experience.length > 0 && (
          <section style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 12, color: '#334155' }}>Experience</div>
            <div style={{ marginTop: 8, display: 'grid', gap: 10 }}>
              {experience.map((x, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <strong>{x.role || 'Role'}</strong>
                    <span style={{ color: '#64748b', fontSize: 13 }}>{x.period || ''}</span>
                  </div>
                  <div style={{ color: '#64748b', fontSize: 14 }}>{x.company || ''}</div>
                  {x.location && <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{x.location}</div>}
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
                  {x.summary && !x.responsibilities && !x.achievements && <div style={{ marginTop: 4, whiteSpace: 'pre-wrap' }}>{x.summary}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <div style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 12, color: '#334155' }}>Education</div>
            <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
              {education.map((e, i) => (
                <div key={i} style={{ marginBottom: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div><strong>{e.degree || 'Degree'}</strong> {e.institution && <span style={{ fontSize: 12, color: '#64748b' }}>at {e.institution}</span>}</div>
                    <div style={{ color: '#64748b', fontSize: 13 }}>{e.year || ''}</div>
                  </div>
                  {(e.startYear || e.endYear || e.gpa || e.coursework || e.keyCourses || e.honors) && (
                    <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>
                      {e.startYear && e.endYear && !e.year && <span>{e.startYear} - {e.endYear}</span>}
                      {e.gpa && <span>{e.startYear && e.endYear && !e.year ? ' • ' : ''}GPA: {e.gpa}</span>}
                      {e.coursework && <span> • Coursework: {e.coursework}</span>}
                      {e.keyCourses && <span> • Key Courses: {e.keyCourses}</span>}
                      {e.honors && <span> • Honors: {e.honors}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}



