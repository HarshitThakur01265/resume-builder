export default function ModernTemplate({ data }) {
  const personal = data?.personal || {}
  const summary = data?.summary || ''
  const experience = Array.isArray(data?.experience) ? data.experience : []
  const education = Array.isArray(data?.education) ? data.education : []
  const skills = Array.isArray(data?.skills) ? data.skills : []

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
        </div>

        {skills.length > 0 && (
          <section style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 12, color: '#334155' }}>Skills</div>
            <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
              {skills.filter(Boolean).slice(0, 8).map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: 13, color: '#0f172a', marginBottom: 4 }}>{s}</div>
                  <div style={{ height: 6, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: `${70 + (i * 3) % 25}%`, height: '100%', background: 'linear-gradient(90deg, #60a5fa, #a78bfa)' }} />
                  </div>
                </div>
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
                  {x.summary && <div style={{ marginTop: 4, whiteSpace: 'pre-wrap' }}>{x.summary}</div>}
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
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div><strong>{e.degree || 'Degree'}</strong></div>
                  <div style={{ color: '#64748b', fontSize: 13 }}>{e.year || ''}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}



