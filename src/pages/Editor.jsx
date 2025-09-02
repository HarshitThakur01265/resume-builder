import { useForm } from 'react-hook-form'
import { saveResume } from '../services/resumes'
import { suggestMissingSkills } from '../services/gemini'

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
  const onSubmit = async (data) => {
    try {
      await saveResume(data)
      alert('Saved!')
    } catch (e) {
      alert(e.message)
    }
  }

  const suggest = async () => {
    const values = getValues()
    const resumeText = JSON.stringify(values)
    const jd = prompt('Paste job description:') || ''
    if (!jd) return
    const tips = await suggestMissingSkills(resumeText, jd)
    alert(tips)
  }

  return (
    <div>
      <h2>Resume Editor</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card" style={{ maxWidth: 820 }}>
          <div className="form-grid">
          <label>
            <span>Template</span>
            <select {...register('template')}>
              <option value="classic">Classic</option>
              <option value="academic">Academic</option>
            </select>
          </label>
          <label>
            <span>Title</span>
            <input {...register('title')} placeholder="Title" />
          </label>
          <label>
            <span>Name</span>
            <input {...register('content.personal.name')} placeholder="John Doe" />
          </label>
          <label>
            <span>Email</span>
            <input {...register('content.personal.email')} placeholder="john@example.com" />
          </label>
          <label>
            <span>Phone</span>
            <input {...register('content.personal.phone')} placeholder="+00 000000" />
          </label>
          <label>
            <span>GitHub URL</span>
            <input {...register('content.links.github')} placeholder="https://github.com/username" />
          </label>
          <label>
            <span>LinkedIn URL</span>
            <input {...register('content.links.linkedin')} placeholder="https://linkedin.com/in/username" />
          </label>
          <label>
            <span>Website</span>
            <input {...register('content.links.website')} placeholder="https://yoursite.com" />
          </label>
          <label>
            <span>Summary</span>
            <textarea {...register('content.summary')} placeholder="Short professional summary" />
          </label>
          <label>
            <span>Experience 1 - Role</span>
            <input {...register('content.experience.0.role')} placeholder="Frontend Developer" />
          </label>
          <label>
            <span>Experience 1 - Company</span>
            <input {...register('content.experience.0.company')} placeholder="ACME Inc." />
          </label>
          <label>
            <span>Experience 1 - Period</span>
            <input {...register('content.experience.0.period')} placeholder="Jan 2021 - Present" />
          </label>
          <label>
            <span>Experience 1 - Summary</span>
            <textarea {...register('content.experience.0.summary')} placeholder="Built X with Y to achieve Z." />
          </label>
          <label>
            <span>Education 1 - Degree</span>
            <input {...register('content.education.0.degree')} placeholder="B.Tech CSE" />
          </label>
          <label>
            <span>Education 1 - Year</span>
            <input {...register('content.education.0.year')} placeholder="2023" />
          </label>
          <label>
            <span>Skill 1</span>
            <input {...register('content.skills.0')} placeholder="React" />
          </label>
          <div className="row">
            <button type="submit">Save</button>
            <button type="button" onClick={suggest}>AI Skill Suggestions</button>
          </div>
          </div>
        </div>
      </form>
    </div>
  )
}

