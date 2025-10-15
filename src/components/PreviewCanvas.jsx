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
import InfographicTemplate from './templates/Infographic'
import ProjectsGrid from './ProjectsGrid'

export default function PreviewCanvas({ resume }) {
  const rawContent = resume?.content || {}
  const content = rawContent?.content || rawContent || {}
  const selected = (resume?.template || rawContent?.template || rawContent?._template || 'classic')

  return (
    <div>
      {selected === 'classic' && <ClassicTemplate data={content} />}
      {selected === 'academic' && <AcademicTemplate data={content} />}
      {selected === 'modern' && <ModernTemplate data={content} />}
      {selected === 'minimal' && <MinimalTemplate data={content} />}
      {selected === 'creative' && <CreativeTemplate data={content} />}
      {selected === 'compact' && <CompactTemplate data={content} />}
      {selected === 'professional' && <ProfessionalTemplate data={content} />}
      {selected === 'technical' && <TechnicalTemplate data={content} />}
      {selected === 'business' && <BusinessTemplate data={content} />}
      {selected === 'sidebar' && <SidebarTemplate data={content} />}
      {selected === 'elegant' && <ElegantTemplate data={content} />}
      {selected === 'gradient' && <GradientTemplate data={content} />}
      {selected === 'timeline' && <TimelineTemplate data={content} />}
      {selected === 'two-column' && <TwoColumnTemplate data={content} />}
      {selected === 'ats' && <ATSTemplate data={content} />}
      {selected === 'infographic' && <InfographicTemplate data={content} />}
      <div className="page-break" style={{ marginTop: '16px' }} />
      <ProjectsGrid projects={content.projects} resumeTitle={resume?.title} />
    </div>
  )
}

