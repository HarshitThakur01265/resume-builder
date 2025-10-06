import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { saveResume } from '../services/resumes'
import { suggestMissingSkills } from '../services/gemini'
import LottieAnimation from '../components/LottieAnimation'
import loadingAnimation from '../assets/animations/loading.json'
import successAnimation from '../assets/animations/success.json'

const defaultValues = {
  title: 'Frontend Developer Resume',
  template: 'academic',
  content: {
    personal: { name: '', email: '', phone: '' },
    links: { github: '', linkedin: '', website: '' },
    summary: '',
    education: [{ degree: '', year: '' }],
    experience: [{ role: '', company: '', period: '', summary: '' }],
    skills: ['']
  }
}

export default function EditorPage() {
  const { register, handleSubmit, getValues } = useForm({ defaultValues })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSuggesting, setIsSuggesting] = useState(false)

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      setIsSuccess(false)
      await saveResume(data)
      setIsLoading(false)
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (e) {
      setIsLoading(false)
      alert(e.message)
    }
  }

  const suggest = async () => {
    const values = getValues()
    const resumeText = JSON.stringify(values)
    const jd = prompt('Paste job description:') || ''
    if (!jd) return
    try {
      setIsSuggesting(true)
      const tips = await suggestMissingSkills(resumeText, jd)
      alert(tips)
    } finally {
      setIsSuggesting(false)
    }
  }

  return (
    <div className="page-glass-wrapper">
      <div className="glass-container glass-border" style={{ maxWidth: 900, padding: '40px', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: 'clamp(28px, 4vw, 36px)', 
            fontWeight: 700,
            background: 'linear-gradient(135deg, var(--text), var(--accent), #4f9ff5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            textShadow: '0 2px 4px rgba(96, 165, 250, 0.2)'
          }}>
            Resume Editor
          </h2>
          <p style={{ color: 'var(--muted)', marginTop: '8px', fontSize: '16px' }}>
            Create and customize your professional resume
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-grid" style={{ gap: '20px' }}>
            <div className="glass-container" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', fontSize: '18px', fontWeight: 600 }}>Basic Information</h3>
              <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Template</span>
                  <select className="glass-input" {...register('template')}>
                    <option value="classic">Classic</option>
                    <option value="academic">Academic</option>
                    <option value="modern">Modern</option>
                    <option value="minimal">Minimal</option>
                    <option value="creative">Creative</option>
                    <option value="compact">Compact</option>
                    <option value="professional">Professional </option>
                    <option value="technical">Technical</option>
                    <option value="business">Business</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="elegant">Elegant</option>
                    <option value="gradient">Gradient</option>
                    <option value="timeline">Timeline</option>
                    <option value="two-column">Two Column</option>
                    <option value="ats">ATS</option>
                    <option value="infographic">Infographic</option>
                  </select>
                </label>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Title</span>
                  <input className="glass-input" {...register('title')} placeholder="Title" />
                </label>
              </div>
            </div>

            <div className="glass-container" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', fontSize: '18px', fontWeight: 600 }}>Personal Information</h3>
              <div style={{ display: 'grid', gap: '16px' }}> 
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Name</span>
                  <input className="glass-input" {...register('content.personal.name')} placeholder="John Doe" />
                </label>
                <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
                  <label style={{ gap: '8px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Email</span>
                    <input className="glass-input" {...register('content.personal.email')} placeholder="john@example.com" />
                  </label>
                  <label style={{ gap: '8px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Phone</span>
                    <input className="glass-input" {...register('content.personal.phone')} placeholder="+00 000000" />
                  </label>
                </div>
              </div>
            </div>

            <div className="glass-container" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', fontSize: '18px', fontWeight: 600 }}>Links</h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>GitHub URL</span>
                  <input className="glass-input" {...register('content.links.github')} placeholder="https://github.com/username" />
                </label>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>LinkedIn URL</span>
                  <input className="glass-input" {...register('content.links.linkedin')} placeholder="https://linkedin.com/in/username" />
                </label>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Website</span>
                  <input className="glass-input" {...register('content.links.website')} placeholder="https://yoursite.com" />
                </label>
              </div>
            </div>

            <div className="glass-container" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', fontSize: '18px', fontWeight: 600 }}>Professional Summary</h3>
              <label style={{ gap: '8px' }}>
                <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Summary</span>
                <textarea 
                  className="glass-input" 
                  {...register('content.summary')} 
                  placeholder="Short professional summary"
                  style={{ minHeight: '100px', resize: 'vertical' }}
                />
              </label>
            </div>

            <div className="glass-container" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', fontSize: '18px', fontWeight: 600 }}>Experience</h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Role</span>
                  <input className="glass-input" {...register('content.experience.0.role')} placeholder="Frontend Developer" />
                </label>
                <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '2fr 1fr' }}>
                  <label style={{ gap: '8px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Company</span>
                    <input className="glass-input" {...register('content.experience.0.company')} placeholder="ACME Inc." />
                  </label>
                  <label style={{ gap: '8px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Period</span>
                    <input className="glass-input" {...register('content.experience.0.period')} placeholder="Jan 2021 - Present" />
                  </label>
                </div>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Summary</span>
                  <textarea 
                    className="glass-input" 
                    {...register('content.experience.0.summary')} 
                    placeholder="Built X with Y to achieve Z."
                    style={{ minHeight: '80px', resize: 'vertical' }}
                  />
                </label>
              </div>
            </div>

            <div className="glass-container" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', fontSize: '18px', fontWeight: 600 }}>Education</h3>
              <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '2fr 1fr' }}>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Degree</span>
                  <input className="glass-input" {...register('content.education.0.degree')} placeholder="B.Tech CSE" />
                </label>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Year</span>
                  <input className="glass-input" {...register('content.education.0.year')} placeholder="2023" />
                </label>
              </div>
            </div>

            <div className="glass-container" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', fontSize: '18px', fontWeight: 600 }}>Skills</h3>
              <label style={{ gap: '8px' }}>
                <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Skill</span>
                <input className="glass-input" {...register('content.skills.0')} placeholder="React" />
              </label>
            </div>

            <div className="row" style={{ gap: '12px', marginTop: '20px', justifyContent: 'center' }}>
              <button className="glass-button" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <LottieAnimation
                    animationData={loadingAnimation}
                    width={20}
                    height={20}
                    className="loading-animation"
                    loop={true}
                    autoplay={true}
                  />
                ) : isSuccess ? (
                  <LottieAnimation
                    animationData={successAnimation}
                    width={20}
                    height={20}
                    className="success-animation"
                    loop={false}
                    autoplay={true}
                  />
                ) : (
                  'Save Resume'
                )}
              </button>
              <button className="glass-button" type="button" onClick={suggest} disabled={isSuggesting}>
                {isSuggesting ? (
                  <LottieAnimation
                    animationData={loadingAnimation}
                    width={20}
                    height={20}
                    className="loading-animation"
                    loop={true}
                    autoplay={true}
                  />
                ) : (
                  'AI Skill Suggestions'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}