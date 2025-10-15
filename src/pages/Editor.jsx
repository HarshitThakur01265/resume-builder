import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
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
    skills: [''],
    projects: [
      {
        title: '',
        shortDescription: '',
        description: '',
        images: [],
        videoUrl: '',
        liveUrl: '',
        figmaUrl: '',
        githubUrl: '',
        link: ''
      }
    ]
  }
}

export default function EditorPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const templateFromUrl = searchParams.get('template')
  
  const formDefaultValues = {
    ...defaultValues,
    template: templateFromUrl || defaultValues.template
  }
  
  const { register, handleSubmit, getValues, setValue } = useForm({ defaultValues: formDefaultValues })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSuggesting, setIsSuggesting] = useState(false)


  // Update template when URL parameter changes
  useEffect(() => {
    if (templateFromUrl) {
      setValue('template', templateFromUrl)
    }
  }, [templateFromUrl, setValue])

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      setIsSuccess(false)
      
      // Save resume to database
      const savedResume = await saveResume(data)
      console.log('Resume saved:', savedResume)
      
      setIsLoading(false)
      setIsSuccess(true)
      
      // Navigate to preview page after successful save
      setTimeout(() => {
        navigate('/preview')
      }, 1500)
      
    } catch (e) {
      setIsLoading(false)
      const message = e?.message || 'Unknown error'
      if (message.includes('Not authenticated')) {
        alert('Please sign in to save your resume.')
        navigate('/auth')
        return
      }
      alert('Save failed: ' + message)
    }
  }

  const suggest = async () => {
    const values = getValues()
    const resumeText = `${values.title}\n\n${values.content.summary}\n\nSkills: ${values.content.skills.join(', ')}`
    const jobDescription = 'Software Developer position requiring technical skills and experience'
    
    try {
      setIsSuggesting(true)
      const suggestions = await suggestMissingSkills(resumeText, jobDescription)
      alert(`AI Skill Suggestions:\n\n${suggestions}`)
    } catch (e) {
      alert('Failed to get suggestions: ' + e.message)
    } finally {
      setIsSuggesting(false)
    }
  }

  return (
    <div className="page-glass-wrapper">
      <div className="glass-container glass-border" style={{ maxWidth: 900, padding: '40px', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ margin: '0 0 8px 0', color: 'var(--text)', fontSize: '32px', fontWeight: 700 }}>
            Resume Editor
          </h1>
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
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>GitHub</span>
                  <input className="glass-input" {...register('content.links.github')} placeholder="https://github.com/username" />
                </label>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>LinkedIn</span>
                  <input className="glass-input" {...register('content.links.linkedin')} placeholder="https://linkedin.com/in/username" />
                </label>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Website</span>
                  <input className="glass-input" {...register('content.links.website')} placeholder="https://yourwebsite.com" />
                </label>
              </div>
            </div>

            <div className="glass-container" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', fontSize: '18px', fontWeight: 600 }}>Summary</h3>
              <label style={{ gap: '8px' }}>
                <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Professional Summary</span>
                <textarea 
                  className="glass-input" 
                  {...register('content.summary')} 
                  placeholder="Brief description of your professional background and key achievements..."
                  style={{ minHeight: '100px', resize: 'vertical' }}
                />
              </label>
            </div>

            <div className="glass-container" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', fontSize: '18px', fontWeight: 600 }}>Education</h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Degree</span>
                  <input className="glass-input" {...register('content.education.0.degree')} placeholder="Bachelor of Science in Computer Science" />
                </label>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Year</span>
                  <input className="glass-input" {...register('content.education.0.year')} placeholder="2020" />
                </label>
              </div>
            </div>

            <div className="glass-container" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', fontSize: '18px', fontWeight: 600 }}>Experience</h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Role</span>
                  <input className="glass-input" {...register('content.experience.0.role')} placeholder="Software Developer" />
                </label>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Company</span>
                  <input className="glass-input" {...register('content.experience.0.company')} placeholder="Tech Company Inc." />
                </label>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Period</span>
                  <input className="glass-input" {...register('content.experience.0.period')} placeholder="2020 - Present" />
                </label>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Summary</span>
                  <textarea 
                    className="glass-input" 
                    {...register('content.experience.0.summary')} 
                    placeholder="Describe your key responsibilities and achievements..."
                    style={{ minHeight: '80px', resize: 'vertical' }}
                  />
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

        <div className="glass-container" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', fontSize: '18px', fontWeight: 600 }}>Projects</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            <label style={{ gap: '8px' }}>
              <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Title</span>
              <input className="glass-input" {...register('content.projects.0.title')} placeholder="Project name" />
            </label>
            <label style={{ gap: '8px' }}>
              <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Short Description</span>
              <input className="glass-input" {...register('content.projects.0.shortDescription')} placeholder="One-liner about the project" />
            </label>
            <label style={{ gap: '8px' }}>
              <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Detailed Description</span>
              <textarea className="glass-input" {...register('content.projects.0.description')} placeholder="What it does, your role, technologies used" style={{ minHeight: '80px', resize: 'vertical' }} />
            </label>
            <label style={{ gap: '8px' }}>
              <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Images (comma separated URLs)</span>
              <input className="glass-input" onChange={(e) => setValue('content.projects.0.images', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="https://...jpg, https://...png" />
            </label>
            <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              <label style={{ gap: '8px' }}>
                <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Video URL (YouTube/Vimeo)</span>
                <input className="glass-input" {...register('content.projects.0.videoUrl')} placeholder="https://www.youtube.com/embed/..." />
              </label>
              <label style={{ gap: '8px' }}>
                <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Live URL (embed)</span>
                <input className="glass-input" {...register('content.projects.0.liveUrl')} placeholder="https://your-live-demo.com" />
              </label>
              <label style={{ gap: '8px' }}>
                <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Figma URL</span>
                <input className="glass-input" {...register('content.projects.0.figmaUrl')} placeholder="https://www.figma.com/file/..." />
              </label>
              <label style={{ gap: '8px' }}>
                <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>GitHub URL</span>
                <input className="glass-input" {...register('content.projects.0.githubUrl')} placeholder="https://github.com/username/repo" />
              </label>
              <label style={{ gap: '8px' }}>
                <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>External Link</span>
                <input className="glass-input" {...register('content.projects.0.link')} placeholder="https://project-site.com" />
              </label>
            </div>
          </div>
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