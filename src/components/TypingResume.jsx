import { useState, useEffect } from 'react'
import TypingEffect from './TypingEffect'
import LottieAnimation from './LottieAnimation'
import writingAnimation from '../assets/animations/writing.json'

export default function TypingResume({ resume, onComplete }) {
  const [currentSection, setCurrentSection] = useState(0)
  const [isTyping, setIsTyping] = useState(true)

  const personal = resume?.content?.personal || {}
  const experience = Array.isArray(resume?.content?.experience) ? resume.content.experience : []
  const education = Array.isArray(resume?.content?.education) ? resume.content.education : []
  const skills = Array.isArray(resume?.content?.skills) ? resume.content.skills : []

  const sections = [
    {
      title: "Name",
      content: personal.name || 'Your Name',
      selector: '.typing-name'
    },
    {
      title: "Email", 
      content: personal.email || 'you@email.com',
      selector: '.typing-email'
    },
    {
      title: "Experience",
      content: experience.map(exp => `${exp.role || 'Role'} @ ${exp.company || 'Company'}`).join(' | '),
      selector: '.typing-experience'
    },
    {
      title: "Education",
      content: education.map(edu => `${edu.degree || 'Degree'} (${edu.year || 'Year'})`).join(' | '),
      selector: '.typing-education'
    },
    {
      title: "Skills",
      content: skills.filter(Boolean).join(' • '),
      selector: '.typing-skills'
    }
  ].filter(section => section.content && section.content.trim())

  useEffect(() => {
    if (currentSection >= sections.length) {
      setIsTyping(false)
      onComplete?.()
      return
    }

    const timer = setTimeout(() => {
      setCurrentSection(prev => prev + 1)
    }, 2000) // Wait 2 seconds between sections

    return () => clearTimeout(timer)
  }, [currentSection, sections.length, onComplete])

  if (!isTyping && currentSection >= sections.length) {
    // Show final resume
    return (
      <div style={{ fontFamily: 'Segoe UI, system-ui, sans-serif', color: 'black' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{personal.name || 'Your Name'}</h2>
          <div style={{ color: '#666', fontSize: '14px' }}>{personal.email || 'you@email.com'}</div>
        </div>

        {experience.length > 0 && (
          <section style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 'bold', borderBottom: '2px solid #333', paddingBottom: '4px' }}>Experience</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {experience.map((x, idx) => (
                <div key={idx} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <strong style={{ fontSize: '16px' }}>{x.role || 'Role'}</strong>
                    <span style={{ color: '#666', fontSize: '14px' }}>@ {x.company || 'Company'}</span>
                  </div>
                  {x.summary && <div style={{ whiteSpace: 'pre-wrap', marginTop: '4px', fontSize: '14px', lineHeight: '1.4' }}>{x.summary}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 'bold', borderBottom: '2px solid #333', paddingBottom: '4px' }}>Education</h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              {education.map((x, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '16px' }}>{x.degree || 'Degree'}</strong>
                  <span style={{ color: '#666', fontSize: '14px' }}>{x.year || ''}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 'bold', borderBottom: '2px solid #333', paddingBottom: '4px' }}>Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {skills.filter(Boolean).map((s, idx) => (
                <span key={idx} style={{ background: '#f0f0f0', color: '#333', padding: '4px 8px', borderRadius: '4px', fontSize: '14px', border: '1px solid #ddd' }}>{s}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', fontFamily: 'Segoe UI, system-ui, sans-serif', color: 'black', minHeight: '400px' }}>
      {/* Pen Animation */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        right: '20px', 
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        <LottieAnimation
          animationData={writingAnimation}
          width={60}
          height={40}
          loop={true}
          autoplay={true}
          speed={1}
        />
      </div>

      {/* Typing Content */}
      <div style={{ padding: '20px' }}>
        {sections.slice(0, currentSection + 1).map((section, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <h3 style={{ 
              margin: '0 0 8px', 
              fontSize: '18px', 
              fontWeight: 'bold', 
              borderBottom: '2px solid #333', 
              paddingBottom: '4px',
              color: index === currentSection ? '#007acc' : '#333'
            }}>
              {section.title}
            </h3>
            <div style={{ fontSize: '16px', minHeight: '24px' }}>
              {index === currentSection ? (
                <TypingEffect
                  strings={[section.content]}
                  typeSpeed={30}
                  backSpeed={20}
                  loop={false}
                  showCursor={true}
                />
              ) : (
                <span style={{ color: '#666' }}>{section.content}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
