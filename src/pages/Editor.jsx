import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { saveResume, getResume, updateResume } from '../services/resumes'
import { suggestMissingSkills, sanitizeAiText } from '../services/gemini'
import LottieAnimation from '../components/LottieAnimation'
import loadingAnimation from '../assets/animations/loading.json'
import successAnimation from '../assets/animations/success.json'

const PROFILE_OPTIONS = [
  { key: 'software', label: 'Software Developer / IT' },
  { key: 'creative', label: 'Creative / Designer' },
  { key: 'marketing', label: 'Marketing / Sales' },
  { key: 'business', label: 'Business / Finance' },
  { key: 'student', label: 'Student / Fresher' },
  { key: 'general', label: 'General / Custom' }
]

const defaultValues = {
  title: 'Frontend Developer Resume',
  template: 'academic',
  profile: 'general',
  content: {
    personal: { name: '', email: '', phone: '' },
    links: { github: '', linkedin: '', website: '' },
    summary: '',
    education: [{ degree: '', year: '' }],
    experience: [{ role: '', company: '', period: '', summary: '' }],
    hasNoExperience: false,
    hasNoProjects: false,
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
  const resumeId = searchParams.get('id')
  const templateFromUrl = searchParams.get('template')
  const profileFromUrl = searchParams.get('profile')
  const isEditing = Boolean(resumeId)
  
  const formDefaultValues = {
    ...defaultValues,
    profile: profileFromUrl || defaultValues.profile,
    template: templateFromUrl || defaultValues.template
  }
  
  const { register, handleSubmit, getValues, setValue, reset, watch } = useForm({ defaultValues: formDefaultValues })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(isEditing) // Start as true if editing, false if creating
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [suggestionModal, setSuggestionModal] = useState({ open: false, text: '' })
  const [dataLoaded, setDataLoaded] = useState(!isEditing) // If not editing, data is "loaded" (using defaults)
  const hasNoExperience = watch('content.hasNoExperience')
  const hasNoProjects = watch('content.hasNoProjects')
  const p = (profileFromUrl || 'general').toLowerCase()
  const isSoftware = p === 'software'
  const isCreative = p === 'creative'
  const isMarketing = p === 'marketing'
  const isStudent = p === 'student'
  const isBusiness = p === 'business'


  // If editing, load existing resume and prefill the form
  useEffect(() => {
    const loadExisting = async () => {
      if (!isEditing) {
        setIsLoadingData(false)
        return
      }
      try {
        setIsLoadingData(true)
        const existing = await getResume(resumeId)
        if (!existing) {
          alert('Resume not found')
          navigate('/resumes')
          return
        }
        // We stored the whole form object in `content` when saving,
        // so we can restore the form by resetting with that object.
        const storedForm = existing.content
        console.log('Loading resume for edit - existing:', existing)
        console.log('Loading resume for edit - storedForm:', storedForm)
        
        if (storedForm && typeof storedForm === 'object') {
          // storedForm is the entire form object: { title, template, profile, content: {...} }
          // Merge with defaults to ensure all fields exist
          const mergedForm = {
            ...formDefaultValues,
            ...storedForm,
            // Ensure content object is properly structured
            content: {
              ...formDefaultValues.content,
              ...(storedForm.content || {}),
              // Handle hasNoExperience - check if experience is empty
              hasNoExperience: (() => {
                const exp = storedForm.content?.experience || []
                if (storedForm.content?.hasNoExperience !== undefined) {
                  return storedForm.content.hasNoExperience
                }
                return exp.length === 0 || (exp.length === 1 && (!exp[0]?.role || exp[0].role.trim() === ''))
              })(),
              hasNoProjects: storedForm.content?.hasNoProjects ?? false
            }
          }
          
          console.log('Loading resume for edit - mergedForm to reset:', mergedForm)
          
          // Use setTimeout to ensure form is ready before resetting
          setTimeout(() => {
            reset(mergedForm)
            setDataLoaded(true)
          }, 100)
        } else {
          // Fallback: at least keep the title from top-level column
          console.warn('No stored form data found, using defaults')
          reset({
            ...formDefaultValues,
            title: existing.title || formDefaultValues.title
          })
          setDataLoaded(true)
        }
      } catch (e) {
        console.error('Failed to load resume for editing:', e)
        alert('Failed to load resume for editing. Please try again.')
        navigate('/resumes')
        setDataLoaded(true) // Set to true even on error so form can render
      } finally {
        setIsLoadingData(false)
      }
    }
    loadExisting()
    // only run on mount / id change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, resumeId])

  // Update template when URL parameter changes (only in create mode)
  useEffect(() => {
    if (!isEditing && templateFromUrl) {
      setValue('template', templateFromUrl)
    }
  }, [templateFromUrl, setValue, isEditing])

  // Update profile when URL parameter changes (set some tailored defaults) in create mode
  useEffect(() => {
    if (isEditing) return
    const p = (profileFromUrl || '').toLowerCase()
    if (!p) return
    setValue('profile', p)
    if (p === 'software') {
      setValue('title', 'Software Developer Resume')
      setValue('template', 'technical')
    } else if (p === 'creative') {
      setValue('title', 'Designer Resume')
      setValue('template', 'creative')
    } else if (p === 'marketing') {
      setValue('title', 'Marketing / Sales Resume')
      setValue('template', 'professional')
    } else if (p === 'student') {
      setValue('title', 'Student Resume')
      setValue('template', 'fresher')
    } else if (p === 'business') {
      setValue('title', 'Business / Finance Resume')
      setValue('template', 'business')
    }
  }, [profileFromUrl, setValue, isEditing])

  // Clear experience fields when "No Experience" is checked
  useEffect(() => {
    if (hasNoExperience) {
      setValue('content.experience.0.role', '')
      setValue('content.experience.0.company', '')
      setValue('content.experience.0.location', '')
      setValue('content.experience.0.startDate', '')
      setValue('content.experience.0.endDate', '')
      setValue('content.experience.0.responsibilities', '')
      setValue('content.experience.0.achievements', '')
    }
  }, [hasNoExperience, setValue])

  // Clear project fields when "No Projects" is checked
  useEffect(() => {
    if (hasNoProjects) {
      setValue('content.projects.0.title', '')
      setValue('content.projects.0.shortDescription', '')
      setValue('content.projects.0.description', '')
      setValue('content.projects.0.tech', '')
      setValue('content.projects.0.images', [])
      setValue('content.projects.0.videoUrl', '')
      setValue('content.projects.0.liveUrl', '')
      setValue('content.projects.0.figmaUrl', '')
      setValue('content.projects.0.caseStudyUrl', '')
      setValue('content.projects.0.githubUrl', '')
      setValue('content.projects.0.link', '')
    }
  }, [hasNoProjects, setValue])

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      setIsSuccess(false)
      
      // Ensure title is not empty
      if (!data.title || data.title.trim() === '') {
        data.title = 'Frontend Developer Resume'
      }
      
      // If "No Experience" is selected, clear the experience array
      if (data.content?.hasNoExperience) {
        data.content.experience = []
      }
      // If "No Projects" is selected, clear the projects array
      if (data.content?.hasNoProjects) {
        data.content.projects = []
      }
      
      let savedResume
      if (isEditing) {
        // Update existing resume
        savedResume = await updateResume(resumeId, data)
      } else {
        // Save new resume to database
        savedResume = await saveResume(data)
      }
      console.log('Resume saved:', savedResume)
      
      if (!savedResume) {
        throw new Error('Resume was not saved. Please try again.')
      }
      
      setIsLoading(false)
      setIsSuccess(true)
      
      // Navigate to preview page after successful save
      setTimeout(() => {
        navigate(`/preview?id=${savedResume.id}`)
      }, 1500)
      
    } catch (e) {
      setIsLoading(false)
      setIsSuccess(false)
      const message = e?.message || 'Unknown error'
      console.error('Save error:', e)
      if (message.includes('Not authenticated')) {
        alert('Please sign in to save your resume.')
        navigate('/auth')
        return
      }
      alert('Save failed: ' + message + '\n\nPlease check your connection and try again.')
    }
  }

  const suggest = async () => {
    const values = getValues()
    const resumeText = `${values.title}\n\n${values.content.summary}\n\nSkills: ${values.content.skills.join(', ')}`
    const jobDescription = 'Software Developer position requiring technical skills and experience'
    try {
      setIsSuggesting(true)
      const raw = await suggestMissingSkills(resumeText, jobDescription)
      const safe = sanitizeAiText(raw, 2000)
      setSuggestionModal({ open: true, text: safe || 'No suggestions returned.' })
    } catch (e) {
      setSuggestionModal({ open: true, text: 'Failed to get suggestions: ' + (e?.message || 'Unknown error') })
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
          <div style={{ marginTop: '10px' }}>
            <span
              className="glass-badge"
              style={{
                display: 'inline-block',
                padding: '6px 10px',
                borderRadius: '9999px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.04)',
                color: 'var(--muted)',
                fontSize: '12px',
                letterSpacing: '0.3px'
              }}
            >
              Profile: {(profileFromUrl || 'general').charAt(0).toUpperCase() + (profileFromUrl || 'general').slice(1)}
            </span>
          </div>

          {/* In-editor profile chooser */}
          <div style={{ marginTop: '16px', display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {PROFILE_OPTIONS.map(opt => (
              <button
                key={opt.key}
                type="button"
                className="glass-button"
                onClick={() => navigate(`/editor?profile=${opt.key}`)}
                style={{
                  padding: '10px 12px',
                  fontSize: '14px',
                  borderColor: (profileFromUrl || 'general') === opt.key ? 'rgba(96,165,250,0.6)' : undefined,
                  background: (profileFromUrl || 'general') === opt.key ? 'rgba(96,165,250,0.12)' : undefined
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {isLoadingData && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <LottieAnimation
              animationData={loadingAnimation}
              width={60}
              height={60}
              className="loading-animation"
              loop={true}
              autoplay={true}
            />
            <p style={{ marginTop: '16px', color: 'var(--muted)', fontSize: '16px' }}>Loading your resume data...</p>
          </div>
        )}

        {!isLoadingData && (
          <form key={dataLoaded ? 'form-loaded' : 'form-loading'} onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register('profile')} />
          <div className="form-grid" style={{ gap: '20px' }}>
            <div className="glass-container" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', fontSize: '18px', fontWeight: 600 }}>Basic Information</h3>
              <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Template</span>
                  <select className="glass-input" {...register('template')}>
                    <option value="classic">Classic</option>
                    <option value="academic">Academic</option>
                    <option value="fresher">Fresher / Student ATS</option>
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
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Location (City, Country)</span>
                  <input className="glass-input" {...register('content.personal.location')} placeholder="City, Country" />
                </label>
              </div>
            </div>

            <div className="glass-container" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', fontSize: '18px', fontWeight: 600 }}>Links</h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                {isCreative ? null : (
                  <label style={{ gap: '8px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>GitHub</span>
                    <input className="glass-input" {...register('content.links.github')} placeholder="https://github.com/username" />
                  </label>
                )}
                {isCreative && (
                  <label style={{ gap: '8px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Portfolio / Behance</span>
                    <input className="glass-input" {...register('content.links.github')} placeholder="https://www.behance.net/username" />
                  </label>
                )}
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>LinkedIn</span>
                  <input className="glass-input" {...register('content.links.linkedin')} placeholder="https://linkedin.com/in/username" />
                </label>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>{isSoftware ? 'Portfolio Website' : 'Website'}</span>
                  <input className="glass-input" {...register('content.links.website')} placeholder={isSoftware ? 'https://portfolio.dev' : 'https://yourwebsite.com'} />
                </label>
              </div>
            </div>

            <div className="glass-container" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', fontSize: '18px', fontWeight: 600 }}>{isBusiness ? 'Executive Summary' : isStudent ? 'Career Objective' : 'Summary'}</h3>
              <label style={{ gap: '8px' }}>
                <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>
                  {isMarketing ? 'Professional Summary (focus on results & metrics)' : isStudent ? 'Objective' : isBusiness ? 'Executive Summary' : 'Professional Summary'}
                </span>
                <textarea 
                  className="glass-input" 
                  {...register('content.summary')} 
                  placeholder={isStudent ? 'What role you are seeking and your immediate goals' : isBusiness ? 'Formal summary of financial expertise and goals' : 'Brief description of your background and key achievements'}
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
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>University / College</span>
                  <input className="glass-input" {...register('content.education.0.institution')} placeholder="University Name" />
                </label>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Start Year</span>
                  <input className="glass-input" {...register('content.education.0.startYear')} placeholder="2018" />
                </label>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>End Year</span>
                  <input className="glass-input" {...register('content.education.0.endYear')} placeholder="2022" />
                </label>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>GPA / Percentage (optional)</span>
                  <input className="glass-input" {...register('content.education.0.gpa')} placeholder="3.8 / 4.0" />
                </label>
                {isBusiness && (
                  <label style={{ gap: '8px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Relevant Coursework (optional)</span>
                    <input className="glass-input" {...register('content.education.0.coursework')} placeholder="Corporate Finance, Financial Reporting" />
                  </label>
                )}
                {isStudent && (
                  <>
                    <label style={{ gap: '8px' }}>
                      <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Key Courses / Modules (optional)</span>
                      <input className="glass-input" {...register('content.keyCourses')} placeholder="Data Structures, DBMS, Algorithms" />
                    </label>
                    <label style={{ gap: '8px' }}>
                      <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Academic Honors / Awards (optional)</span>
                      <input className="glass-input" {...register('content.honors')} placeholder="Dean’s List 2024" />
                    </label>
                  </>
                )}
              </div>
            </div>

            <div className="glass-container" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', fontSize: '18px', fontWeight: 600 }}>Experience</h3>
              <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(96, 165, 250, 0.05)', borderRadius: '8px', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    {...register('content.hasNoExperience')}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 500 }}>
                    I don't have any work experience (NA)
                  </span>
                </label>
              </div>
              <div style={{ display: 'grid', gap: '16px', opacity: hasNoExperience ? 0.5 : 1, pointerEvents: hasNoExperience ? 'none' : 'auto' }}>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Role</span>
                  <input className="glass-input" {...register('content.experience.0.role')} placeholder="Software Developer" disabled={hasNoExperience} />
                </label>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Company</span>
                  <input className="glass-input" {...register('content.experience.0.company')} placeholder="Tech Company Inc." disabled={hasNoExperience} />
                </label>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Location</span>
                  <input className="glass-input" {...register('content.experience.0.location')} placeholder="City, Country" disabled={hasNoExperience} />
                </label>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Start Date</span>
                  <input className="glass-input" {...register('content.experience.0.startDate')} placeholder="2022-01" disabled={hasNoExperience} />
                </label>
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>End Date</span>
                  <input className="glass-input" {...register('content.experience.0.endDate')} placeholder="2024-12 or Present" disabled={hasNoExperience} />
                </label>
                {!isMarketing && (
                  <label style={{ gap: '8px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Responsibilities</span>
                    <textarea className="glass-input" {...register('content.experience.0.responsibilities')} placeholder="Use bullet points for responsibilities and impact" style={{ minHeight: '80px', resize: 'vertical' }} disabled={hasNoExperience} />
                  </label>
                )}
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>{isMarketing || isBusiness ? 'Key Achievements (use metrics)' : 'Achievements'}</span>
                  <textarea className="glass-input" {...register('content.experience.0.achievements')} placeholder={isMarketing ? 'e.g., Increased lead conversion by 30%; Reduced CPA by 18%' : 'Outcomes, wins, impact'} style={{ minHeight: '80px', resize: 'vertical' }} disabled={hasNoExperience} />
                </label>
              </div>
            </div>

            <div className="glass-container" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', fontSize: '18px', fontWeight: 600 }}>{isSoftware ? 'Technical Skills (Languages, Frameworks, Databases, Tools)' : isMarketing ? 'Skills (Digital Tools, CRM, Soft Skills)' : isStudent ? 'Skills (Technical & Soft)' : 'Skills'}</h3>
              {isSoftware ? (
                <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                  <label style={{ gap: '8px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Languages</span>
                    <input className="glass-input" {...register('content.skillsLanguages')} placeholder="JavaScript, TypeScript, Python" />
                  </label>
                  <label style={{ gap: '8px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Frameworks</span>
                    <input className="glass-input" {...register('content.skillsFrameworks')} placeholder="React, Node.js, Express" />
                  </label>
                  <label style={{ gap: '8px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Databases</span>
                    <input className="glass-input" {...register('content.skillsDatabases')} placeholder="PostgreSQL, MongoDB" />
                  </label>
                  <label style={{ gap: '8px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Tools</span>
                    <input className="glass-input" {...register('content.skillsTools')} placeholder="Git, Docker, AWS" />
                  </label>
                </div>
              ) : isMarketing ? (
                <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                  <label style={{ gap: '8px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Digital Tools</span>
                    <input className="glass-input" {...register('content.skillsTools')} placeholder="GA4, Ads Manager, HubSpot" />
                  </label>
                  <label style={{ gap: '8px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>CRM</span>
                    <input className="glass-input" {...register('content.skillsCrm')} placeholder="Salesforce, Zoho" />
                  </label>
                  <label style={{ gap: '8px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Soft Skills</span>
                    <input className="glass-input" {...register('content.skillsSoft')} placeholder="Communication, Negotiation" />
                  </label>
                </div>
              ) : (
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Skill</span>
                  <input className="glass-input" {...register('content.skills.0')} placeholder="React" />
                </label>
              )}
            </div>

        <div className="glass-container" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', fontSize: '18px', fontWeight: 600 }}>{isCreative ? 'Portfolio Showcase' : isStudent ? 'Academic Projects' : isMarketing ? 'Projects / Campaigns' : 'Projects'}</h3>
          <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(96, 165, 250, 0.05)', borderRadius: '8px', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                {...register('content.hasNoProjects')}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 500 }}>
                I don't have any projects to list
              </span>
            </label>
          </div>
          <div style={{ display: 'grid', gap: '16px', opacity: hasNoProjects ? 0.5 : 1, pointerEvents: hasNoProjects ? 'none' : 'auto' }}>
            <label style={{ gap: '8px' }}>
              <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Title</span>
              <input className="glass-input" {...register('content.projects.0.title')} placeholder="Project name" disabled={hasNoProjects} />
            </label>
            <label style={{ gap: '8px' }}>
              <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>{isMarketing ? 'Campaign Summary' : 'Short Description'}</span>
              <input className="glass-input" {...register('content.projects.0.shortDescription')} placeholder={isMarketing ? 'One-liner about campaign and objective' : 'One-liner about the project'} disabled={hasNoProjects} />
            </label>
            {isCreative && (
              <label style={{ gap: '8px' }}>
                <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Client or Purpose</span>
                <input className="glass-input" {...register('content.projects.0.client')} placeholder="Client XYZ / University Project" disabled={hasNoProjects} />
              </label>
            )}
            <label style={{ gap: '8px' }}>
              <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Detailed Description</span>
              <textarea className="glass-input" {...register('content.projects.0.description')} placeholder="What it does, your role, technologies used" style={{ minHeight: '80px', resize: 'vertical' }} disabled={hasNoProjects} />
            </label>
            <label style={{ gap: '8px' }}>
              <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>{isCreative ? 'My Role' : isMarketing ? 'My Contribution' : 'Technologies Used (comma separated)'}</span>
              <input className="glass-input" {...register('content.projects.0.tech')} placeholder={isCreative ? 'UI/UX Designer, Brand Strategist' : isMarketing ? 'Owned email strategy; built dashboards' : 'React, Node.js, PostgreSQL'} disabled={hasNoProjects} />
            </label>
            <label style={{ gap: '8px' }}>
              <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>{isCreative ? 'Images (portfolio shots, comma separated URLs)' : 'Images (comma separated URLs)'}</span>
              <input className="glass-input" onChange={(e) => setValue('content.projects.0.images', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder={isCreative ? 'https://...portfolio1.jpg, https://...shot2.png' : 'https://...jpg, https://...png'} disabled={hasNoProjects} />
            </label>
            <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              <label style={{ gap: '8px' }}>
                <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Video URL (YouTube/Vimeo)</span>
                <input className="glass-input" {...register('content.projects.0.videoUrl')} placeholder="https://www.youtube.com/embed/..." disabled={hasNoProjects} />
              </label>
              <label style={{ gap: '8px' }}>
                <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Live URL (embed)</span>
                <input className="glass-input" {...register('content.projects.0.liveUrl')} placeholder="https://your-live-demo.com" disabled={hasNoProjects} />
              </label>
              {isCreative && (
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Figma URL</span>
                  <input className="glass-input" {...register('content.projects.0.figmaUrl')} placeholder="https://www.figma.com/file/..." disabled={hasNoProjects} />
                </label>
              )}
              {isCreative && (
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>Link to Full Case Study</span>
                  <input className="glass-input" {...register('content.projects.0.caseStudyUrl')} placeholder="https://portfolio.site/case-study" disabled={hasNoProjects} />
                </label>
              )}
              {isSoftware && (
                <label style={{ gap: '8px' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>GitHub URL</span>
                  <input className="glass-input" {...register('content.projects.0.githubUrl')} placeholder="https://github.com/username/repo" disabled={hasNoProjects} />
                </label>
              )}
              <label style={{ gap: '8px' }}>
                <span style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: 500 }}>External Link</span>
                <input className="glass-input" {...register('content.projects.0.link')} placeholder="https://project-site.com" disabled={hasNoProjects} />
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
        )}
      </div>

      {/* AI suggestions modal */}
      {suggestionModal.open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="suggestion-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.5)',
            padding: 24
          }}
          onClick={() => setSuggestionModal((m) => ({ ...m, open: false }))}
        >
          <div
            className="glass-container glass-border"
            style={{
              maxWidth: 480,
              maxHeight: '80vh',
              padding: 24,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 48px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="suggestion-modal-title" style={{ margin: '0 0 12px 0', fontSize: 18, fontWeight: 600 }}>
              AI Skill Suggestions
            </h3>
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: 14,
                lineHeight: 1.6,
                color: 'var(--text)',
                marginBottom: 16
              }}
            >
              {suggestionModal.text}
            </div>
            <button
              type="button"
              className="glass-button"
              onClick={() => setSuggestionModal((m) => ({ ...m, open: false }))}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}