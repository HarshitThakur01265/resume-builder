export default function FresherTemplate({ data }) {
  const personal = data?.personal || {}
  const links = data?.links || {}
  const summary = data?.summary || ''
  const education = Array.isArray(data?.education) ? data.education : []
  const projects = Array.isArray(data?.projects) ? data.projects : []
  const experience = Array.isArray(data?.experience) ? data.experience : []
  const skills = Array.isArray(data?.skills) ? data.skills : []

  const skillItems = skills
    .filter(Boolean)
    .flatMap((s) =>
      String(s)
        .split(/[.,\n]/)
        .map((t) => t.trim())
        .filter(Boolean),
    )

  const Section = ({ title, children }) => (
    <section style={{ marginTop: 16 }}>
      <h3
        style={{
          margin: '0 0 6px',
          fontSize: 14,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {title}
      </h3>
      {children}
    </section>
  )

  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        color: '#111',
        lineHeight: 1.4,
        fontSize: 12,
      }}
    >
      {/* Header */}
      <header style={{ borderBottom: '1px solid #ddd', paddingBottom: 6, marginBottom: 8 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{personal.name || 'Your Name'}</div>
        <div style={{ marginTop: 2, color: '#444' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.email && (personal.phone || personal.location) && <span> • </span>}
          {personal.phone && <span>{personal.phone}</span>}
          {(personal.email || personal.phone) && personal.location && <span> • </span>}
          {personal.location && <span>{personal.location}</span>}
        </div>
        {(links.github || links.linkedin || links.website) && (
          <div style={{ marginTop: 2, color: '#0b63ce' }}>
            {links.github && (
              <span style={{ marginRight: 8 }}>
                GitHub: {links.github.replace(/^https?:\/\//, '')}
              </span>
            )}
            {links.linkedin && (
              <span style={{ marginRight: 8 }}>
                LinkedIn: {links.linkedin.replace(/^https?:\/\//, '')}
              </span>
            )}
            {links.website && <span>Portfolio: {links.website.replace(/^https?:\/\//, '')}</span>}
          </div>
        )}
      </header>

      {/* Summary (optional but helpful for fresher) */}
      {summary && (
        <Section title="Career Objective">
          <div style={{ whiteSpace: 'pre-wrap', color: '#333' }}>{summary}</div>
        </Section>
      )}

      {/* Education on top for fresher */}
      {education.length > 0 && (
        <Section title="Education">
          {education.map((e, idx) => (
            <div key={idx} style={{ marginBottom: 6 }}>
              <div style={{ fontWeight: 600 }}>
                {e.degree || 'Degree'}
                {e.institution && ` — ${e.institution}`}
              </div>
              {(e.year || e.startYear || e.endYear || e.gpa) && (
                <div style={{ color: '#555' }}>
                  {e.year ||
                    (e.startYear && e.endYear && `${e.startYear} - ${e.endYear}`) ||
                    e.startYear ||
                    e.endYear}
                  {e.gpa && (
                    <>
                      {' '}
                      • GPA: {e.gpa}
                    </>
                  )}
                </div>
              )}
              {e.coursework && (
                <div style={{ marginTop: 2 }}>
                  <strong>Coursework:</strong> {e.coursework}
                </div>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Academic / Personal projects */}
      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p, idx) => (
            <div key={idx} style={{ marginBottom: 6 }}>
              <div style={{ fontWeight: 600 }}>
                {p.title || 'Project Title'}
                {p.shortDescription && ` — ${p.shortDescription}`}
              </div>
              {p.techStack && (
                <div style={{ color: '#555', marginTop: 2 }}>
                  <strong>Tech:</strong> {p.techStack}
                </div>
              )}
              {p.description && (
                <div style={{ whiteSpace: 'pre-wrap', marginTop: 2 }}>{p.description}</div>
              )}
              {(p.githubUrl || p.liveUrl) && (
                <div style={{ color: '#0b63ce', marginTop: 2 }}>
                  {p.githubUrl && <span style={{ marginRight: 8 }}>GitHub: {p.githubUrl}</span>}
                  {p.liveUrl && <span>Live: {p.liveUrl}</span>}
                </div>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Internships / Training (if any experience is present) */}
      {experience.length > 0 && (
        <Section title="Internships & Training">
          {experience.map((x, idx) => (
            <div key={idx} style={{ marginBottom: 6 }}>
              <div style={{ fontWeight: 600 }}>
                {x.role || 'Intern'}
                {x.company && ` — ${x.company}`}
              </div>
              {(x.period || x.startDate || x.endDate || x.location) && (
                <div style={{ color: '#555' }}>
                  {x.period ||
                    (x.startDate && x.endDate && `${x.startDate} - ${x.endDate}`) ||
                    x.startDate ||
                    x.endDate}
                  {x.location && (
                    <>
                      {' '}
                      • {x.location}
                    </>
                  )}
                </div>
              )}
              {x.summary && (
                <div style={{ whiteSpace: 'pre-wrap', marginTop: 2 }}>{x.summary}</div>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {skillItems.length > 0 && (
        <Section title="Skills">
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {skillItems.map((s, idx) => (
              <li key={idx} style={{ marginBottom: 2 }}>
                {s}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  )
}

