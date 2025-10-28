import { Routes, Route, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AuthPage from './pages/Auth'
import EditorPage from './pages/Editor'
import PreviewPage from './pages/Preview'
import ProjectPublicPage from './pages/ProjectPublic'
import ChatbotPage from './pages/Chatbot'
import ResumesPage from './pages/Resumes'
import ProfileSelectPage from './pages/ProfileSelect'
import HomeTypingEffect from './components/HomeTypingEffect'
import TemplatePreviewGrid from './components/TemplatePreviewGrid'
import Beams from './components/Beams'
import FloatingAITeaser from './components/FloatingAITeaser'
import MagicClick from './components/MagicClick'
import AnimatedSideDrawer from './components/AnimatedSideDrawer'
import HamburgerMenu from './components/HamburgerMenu'
import './App.css'
import heroIllustration from './assets/hero-illustration.svg'

function Layout({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'
  })
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
  }

  return (
    <div className="app-container">
      <MagicClick />
      <Beams beamNumber={12} beamWidth={2} beamHeight={15} speed={theme === 'dark' ? 2.2 : 1.6} noiseIntensity={theme === 'dark' ? 1.75 : 1.2} />
      <header className="app-header">
        <nav className="nav">
          <div className="brand">Resumify</div>
          <div className="spacer" />
          <HamburgerMenu isOpen={isDrawerOpen} onClick={toggleDrawer} />
        </nav>
      </header>
      <main className="main-content">{children}</main>
      <AnimatedSideDrawer 
        isOpen={isDrawerOpen} 
        onClose={closeDrawer}
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  )
}

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  
  const quotes = [
    {
      text: "Your career, your story — we just help you write it better.",
      author: "Resume Builder"
    },
    {
      text: "Stand out from the crowd with a resume that tells your unique story.",
      author: "Resume Builder"
    },
    {
      text: "First impressions matter. Make yours count with a professional resume.",
      author: "Resume Builder"
    },
    {
      text: "Transform your experience into opportunities with the perfect resume.",
      author: "Resume Builder"
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % quotes.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + quotes.length) % quotes.length)
  }

  // Auto-slide every 5 seconds (pauses on hover) with stable interval
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % quotes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isPaused, quotes.length])

  // Touch swipe handlers
  const [touchStartX, setTouchStartX] = useState(null)
  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return
    setTouchStartX(e.touches[0].clientX)
  }
  const handleTouchEnd = (e) => {
    if (touchStartX === null) return
    const endX = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : touchStartX
    const delta = endX - touchStartX
    const threshold = 50
    if (Math.abs(delta) > threshold) {
      if (delta < 0) nextSlide()
      else prevSlide()
    }
    setTouchStartX(null)
  }

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') nextSlide()
    if (e.key === 'ArrowLeft') prevSlide()
  }

  return (
    <div className="home-container">
      {/* Hero Illustration */}
      <div className="hero-illustration">
        <img 
          src={heroIllustration} 
          alt="Professional resume building illustration"
          className="hero-image"
        />
      </div>
      
      {/* Typing Resume Effect */}
      <div style={{ margin: '20px 0' }}>
        <HomeTypingEffect />
      </div>

      {/* Interactive Resume Templates */}
      <div style={{ margin: '30px 0' }}>
        <h2 style={{ margin: '0 0 10px' }}>Try a template</h2>
        <p style={{ margin: '0 0 14px', color: 'var(--muted-text, #cbd5e1)' }}>Hover and click to preview how your resume could look.</p>
        <TemplatePreviewGrid />
      </div>

      {/* Floating AI Assistant teaser */}
      <FloatingAITeaser
        corner="bottom-right"
        imageUrl="https://i.pinimg.com/originals/8c/fe/6d/8cfe6d7b4d9b1d9e8b2c33e28a2a4fd5.jpg"
      />

      
      
      <div
        className="quote-carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onKeyDown={handleKeyDown}
        role="region"
        aria-roledescription="carousel"
        aria-label="Quotes carousel"
        tabIndex={0}
      >
        <div
          className="quote-slides-container"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="quote-slides" 
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {quotes.map((quote, index) => (
              <div
                key={index}
                className="quote-slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${index + 1} of ${quotes.length}`}
              >
                <div className="quote-section">
                  <div className="quote-mark">"</div>
                  <blockquote className="inspirational-quote">
                    {quote.text}
                  </blockquote>
                  <div className="quote-author">— {quote.author}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="slide-indicators">
        {quotes.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? 'true' : undefined}
          />
        ))}
      </div>
      
      <div className="home-content">
        <h1>Resume Builder</h1>
        <p>Create professional resumes that stand out from the crowd.</p>
        <div className="cta-buttons">
          <Link to="/auth" className="cta-primary">
            Get Started
          </Link>
          <Link to="/choose-profile" className="cta-secondary">
            Sign In to Build Resume
          </Link>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/choose-profile" element={<ProfileSelectPage />} />
        <Route path="/resumes" element={<ResumesPage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/project" element={<ProjectPublicPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
      </Routes>
    </Layout>
  )
}

export default App
