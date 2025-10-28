import { Link, useNavigate } from 'react-router-dom'

const profiles = [
  { key: 'software', label: 'Software Developer / IT', emoji: '💻' },
  { key: 'creative', label: 'Creative / Designer', emoji: '🎨' },
  { key: 'marketing', label: 'Marketing / Sales', emoji: '📈' },
  { key: 'business', label: 'Business / Finance', emoji: '💼' },
  { key: 'student', label: 'Student / Fresher', emoji: '🎓' },
  { key: 'general', label: 'General / Custom', emoji: '🧰' }
]

export default function ProfileSelectPage() {
  const navigate = useNavigate()

  const handleChoose = (key) => {
    navigate(`/editor?profile=${encodeURIComponent(key)}`)
  }

  return (
    <div className="page-glass-wrapper">
      <div className="glass-container glass-border" style={{ maxWidth: 900, padding: '40px', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ margin: '0 0 8px 0', color: 'var(--text)', fontSize: '32px', fontWeight: 700 }}>
            Choose Your Profile
          </h1>
          <p style={{ color: 'var(--muted)', marginTop: '8px', fontSize: '16px' }}>
            What kind of resume are you building?
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {profiles.map((p) => (
            <button
              key={p.key}
              className="glass-button"
              onClick={() => handleChoose(p.key)}
              style={{
                padding: '20px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '16px'
              }}
            >
              <span style={{ fontSize: '22px' }}>{p.emoji}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/editor" style={{ color: 'var(--muted)', fontSize: '14px' }}>
            Skip for now
          </Link>
        </div>
      </div>
    </div>
  )
}



