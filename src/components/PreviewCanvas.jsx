import { motion, AnimatePresence } from 'framer-motion'
import ClassicTemplate from './templates/Classic'
import AcademicTemplate from './templates/Academic'
import ModernTemplate from './templates/Modern'
import MinimalTemplate from './templates/Minimal'
import CreativeTemplate from './templates/Creative'
import CompactTemplate from './templates/Compact'
import ProfessionalTemplate from './templates/Professional'
import TechnicalTemplate from './templates/Technical'
import BusinessTemplate from './templates/Business'
import SidebarTemplate from './templates/Sidebar'
import ElegantTemplate from './templates/Elegant'
import GradientTemplate from './templates/Gradient'
import TimelineTemplate from './templates/Timeline'
import TwoColumnTemplate from './templates/TwoColumn'
import ATSTemplate from './templates/ATS'
import FresherTemplate from './templates/Fresher'
import InfographicTemplate from './templates/Infographic'
import ProjectsGrid from './ProjectsGrid'

// Helper function to format date period
function formatPeriod(startDate, endDate) {
  if (startDate && endDate) {
    return `${startDate} - ${endDate}`
  }
  if (startDate) {
    return `${startDate} - Present`
  }
  return ''
}

// Helper function to normalize skills array
function normalizeSkills(data) {
  const skills = Array.isArray(data?.skills) ? data.skills : []
  
  // Handle specialized skills fields
  const specialized = []
  if (data?.skillsLanguages) {
    const langs = typeof data.skillsLanguages === 'string' 
      ? data.skillsLanguages.split(',').map(s => s.trim()).filter(Boolean)
      : Array.isArray(data.skillsLanguages) ? data.skillsLanguages : []
    specialized.push(...langs.map(l => `Languages: ${l}`))
  }
  if (data?.skillsFrameworks) {
    const frameworks = typeof data.skillsFrameworks === 'string'
      ? data.skillsFrameworks.split(',').map(s => s.trim()).filter(Boolean)
      : Array.isArray(data.skillsFrameworks) ? data.skillsFrameworks : []
    specialized.push(...frameworks.map(f => `Frameworks: ${f}`))
  }
  if (data?.skillsDatabases) {
    const databases = typeof data.skillsDatabases === 'string'
      ? data.skillsDatabases.split(',').map(s => s.trim()).filter(Boolean)
      : Array.isArray(data.skillsDatabases) ? data.skillsDatabases : []
    specialized.push(...databases.map(d => `Databases: ${d}`))
  }
  if (data?.skillsTools) {
    const tools = typeof data.skillsTools === 'string'
      ? data.skillsTools.split(',').map(s => s.trim()).filter(Boolean)
      : Array.isArray(data.skillsTools) ? data.skillsTools : []
    specialized.push(...tools)
  }
  if (data?.skillsCrm) {
    const crm = typeof data.skillsCrm === 'string'
      ? data.skillsCrm.split(',').map(s => s.trim()).filter(Boolean)
      : Array.isArray(data.skillsCrm) ? data.skillsCrm : []
    specialized.push(...crm.map(c => `CRM: ${c}`))
  }
  if (data?.skillsSoft) {
    const soft = typeof data.skillsSoft === 'string'
      ? data.skillsSoft.split(',').map(s => s.trim()).filter(Boolean)
      : Array.isArray(data.skillsSoft) ? data.skillsSoft : []
    specialized.push(...soft)
  }
  
  // Combine regular skills with specialized, removing duplicates
  const allSkills = [...skills.filter(Boolean), ...specialized]
  return allSkills.length > 0 ? allSkills : skills
}

// Helper function to normalize experience data
function normalizeExperience(experience) {
  if (!Array.isArray(experience)) return []
  return experience.map(exp => ({
    ...exp,
    period: exp.period || formatPeriod(exp.startDate, exp.endDate)
  }))
}

// Helper function to normalize education data
function normalizeEducation(education) {
  if (!Array.isArray(education)) return []
  return education.map(edu => ({
    ...edu,
    year: edu.year || (edu.startYear && edu.endYear ? `${edu.startYear} - ${edu.endYear}` : edu.startYear || edu.endYear || '')
  }))
}

export default function PreviewCanvas({ resume }) {
  const rawContent = resume?.content || {}
  const content = rawContent?.content || rawContent || {}
  const selected = (resume?.template || rawContent?.template || rawContent?._template || 'classic')
  
  // Normalize the content data
  const normalizedContent = {
    ...content,
    skills: normalizeSkills(content),
    experience: normalizeExperience(content.experience),
    education: normalizeEducation(content.education)
  }

  const templateProps = { data: normalizedContent }
  const templateMap = {
    classic: <ClassicTemplate {...templateProps} />,
    academic: <AcademicTemplate {...templateProps} />,
    modern: <ModernTemplate {...templateProps} />,
    minimal: <MinimalTemplate {...templateProps} />,
    creative: <CreativeTemplate {...templateProps} />,
    compact: <CompactTemplate {...templateProps} />,
    professional: <ProfessionalTemplate {...templateProps} />,
    technical: <TechnicalTemplate {...templateProps} />,
    business: <BusinessTemplate {...templateProps} />,
    sidebar: <SidebarTemplate {...templateProps} />,
    elegant: <ElegantTemplate {...templateProps} />,
    gradient: <GradientTemplate {...templateProps} />,
    timeline: <TimelineTemplate {...templateProps} />,
    'two-column': <TwoColumnTemplate {...templateProps} />,
    ats: <ATSTemplate {...templateProps} />,
    fresher: <FresherTemplate {...templateProps} />,
    infographic: <InfographicTemplate {...templateProps} />
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ minHeight: 1 }}
        >
          {templateMap[selected] || templateMap.classic}
        </motion.div>
      </AnimatePresence>
      <ProjectsGrid projects={normalizedContent.projects} resumeTitle={resume?.title} />
    </div>
  )
}

