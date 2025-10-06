export default function ATSTemplate({ data }) {
  const personal = data?.personal || {}
  const summary = data?.summary || ''
  const experience = Array.isArray(data?.experience) ? data.experience : []
  const education = Array.isArray(data?.education) ? data.education : []
  const skills = Array.isArray(data?.skills) ? data.skills : []
  return (
    <div style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: '#000' }}>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{personal.name || 'Your Name'}</div>
      <div style={{ fontSize: 12, color: '#333', marginBottom: 8 }}>{personal.email || ''}</div>
      {summary && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 700 }}>Summary</div>
          <div style={{ marginTop: 4 }}>{summary}</div>
        </div>
      )}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontWeight: 700 }}>Experience</div>
        {experience.map((x, i) => (
          <div key={i} style={{ marginTop: 6 }}>
            <div><strong>{x.role || 'Role'}</strong> — {x.company || ''}</div>
            {x.summary && <div style={{ marginTop: 4, whiteSpace: 'pre-wrap' }}>{x.summary}</div>}
          </div>
        ))}
      </div>
      {education.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 700 }}>Education</div>
          {education.map((e, i) => (
            <div key={i} style={{ marginTop: 4 }}><strong>{e.degree || 'Degree'}</strong> — {e.year || ''}</div>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div>
          <div style={{ fontWeight: 700 }}>Skills</div>
          <div style={{ marginTop: 4 }}>{skills.filter(Boolean).join(', ')}</div>
        </div>
      )}
    </div>
  )
}








