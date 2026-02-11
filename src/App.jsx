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
import SplashScreen from './components/SplashScreen'
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
      {/* Floating AI Assistant - Available on all pages */}
      <FloatingAITeaser corner="bottom-right" />
    </div>
  )
}

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [revealed, setRevealed] = useState({ hero: false, how: false, cta: false })
  
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

  useEffect(() => {
    const entriesMap = { hero: null, how: null, cta: null }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const key = entry.target.getAttribute('data-reveal-key')
        if (entry.isIntersecting && key) {
          setRevealed((prev) => ({ ...prev, [key]: true }))
          io.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15 })

    const heroEl = document.querySelector('[data-reveal-key="hero"]')
    const howEl = document.querySelector('[data-reveal-key="how"]')
    const ctaEl = document.querySelector('[data-reveal-key="cta"]')
    if (heroEl) io.observe(heroEl)
    if (howEl) io.observe(howEl)
    if (ctaEl) io.observe(ctaEl)
    return () => io.disconnect()
  }, [])

  return (
    <div className="home-container" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
          pointerEvents: 'none'
        }}
      >
        <source src="/background-video.mp4" type="video/mp4" />
      </video>
      {/* Overlay for better content readability */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(11, 15, 25, 0.6)',
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />
      {/* Product-first Hero: headline + template previews */}
      <section data-reveal-key="hero" className={revealed.hero ? 'reveal-in' : ''} style={{ width: '100%', maxWidth: '1100px', margin: '0 auto 26px', transition: 'opacity .6s ease, transform .6s ease', opacity: revealed.hero ? 1 : 0, transform: revealed.hero ? 'none' : 'translateY(16px)', position: 'relative', zIndex: 1 }}>
        <h1 style={{
          margin: 0,
          fontSize: 'clamp(28px, 5vw, 48px)',
          fontWeight: 800,
          letterSpacing: '-0.02em'
        }}>
          Build a resume that gets you hired<span style={{ color: 'var(--accent)' }}>.</span>
        </h1>
        <p style={{ margin: '8px 0 16px', color: 'var(--muted)', fontSize: 'clamp(14px, 2vw, 18px)' }}>
          Create, customize, and download a professional resume in minutes with our stunning templates.
        </p>
        <TemplatePreviewGrid />
      </section>

      {/* How it works */}
      <section data-reveal-key="how" className={revealed.how ? 'reveal-in' : ''} style={{ width: '100%', maxWidth: '1100px', margin: '24px auto 10px', transition: 'opacity .6s ease, transform .6s ease', opacity: revealed.how ? 1 : 0, transform: revealed.how ? 'none' : 'translateY(16px)', position: 'relative', zIndex: 1 }}>
        <h3 style={{ margin: '0 0 10px' }}>How it works</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          <div className="glass-container" style={{ padding: '16px', display: 'flex', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800 }}>1</div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Pick a template</div>
              <div style={{ color: 'var(--muted)', fontSize: 14 }}>Choose from professionally designed, field-tested templates.</div>
            </div>
          </div>
          <div className="glass-container" style={{ padding: '16px', display: 'flex', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800 }}>2</div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Add your story</div>
              <div style={{ color: 'var(--muted)', fontSize: 14 }}>Use the simple editor and AI tips to fill in your details.</div>
            </div>
          </div>
          <div className="glass-container" style={{ padding: '16px', display: 'flex', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800 }}>3</div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Download & apply</div>
              <div style={{ color: 'var(--muted)', fontSize: 14 }}>Export to PDF and start applying with confidence.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Single testimonial */}
      <section className="quote-section" style={{ maxWidth: 800, margin: '18px auto 0', position: 'relative', zIndex: 1 }}>
        <div className="quote-mark">"</div>
        <blockquote className="inspirational-quote">
          First impressions matter. Make yours count with a professional resume.
        </blockquote>
        <div className="quote-author">— Resumify</div>
      </section>
      
      <div data-reveal-key="cta" className={`home-content ${revealed.cta ? 'reveal-in' : ''}`} style={{ opacity: revealed.cta ? undefined : 0, transform: revealed.cta ? undefined : 'translateY(20px)', position: 'relative', zIndex: 1 }}>
        <h1>Ready to get started<span style={{ color: 'var(--accent)' }}>?</span></h1>
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
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // Check if splash has been shown in this session
    const splashShown = sessionStorage.getItem('splashShown')
    if (splashShown === 'true') {
      setShowSplash(false)
    }
  }, [])

  const handleSplashComplete = () => {
    sessionStorage.setItem('splashShown', 'true')
    setShowSplash(false)
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

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
