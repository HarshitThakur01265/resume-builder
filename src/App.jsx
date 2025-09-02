import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'
// removed Mantine UI usage in layout; keep plain CSS nav for compatibility
import AuthPage from './pages/Auth'
import EditorPage from './pages/Editor'
import PreviewPage from './pages/Preview'
import ChatbotPage from './pages/Chatbot'
import ResumesPage from './pages/Resumes'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function Layout({ children }) {
  const location = useLocation()
  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/auth', label: 'Auth' },
    { to: '/editor', label: 'Editor' },
    { to: '/resumes', label: 'Resumes' },
    { to: '/preview', label: 'Preview' },
    { to: '/chatbot', label: 'Chatbot' }
  ]
  return (
    <div className="app-container">
      <header className="app-header">
        <nav className="nav">
          <div className="brand">Resume Builder</div>
          {links.map((l) => {
            const active = l.end ? location.pathname === l.to : location.pathname.startsWith(l.to)
            return (
              <NavLink key={l.to} to={l.to} end={l.end} className={active ? 'active' : ''}>{l.label}</NavLink>
            )
          })}
          <div className="spacer" />
        </nav>
      </header>
      <main className="main-content">{children}</main>
    </div>
  )
}

function Home() {
  return (
    <div>
      <h1>Resume Builder</h1>
      <p>Sign in to start creating and managing resumes.</p>
    </div>
  )
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/editor" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
        <Route path="/resumes" element={<ProtectedRoute><ResumesPage /></ProtectedRoute>} />
        <Route path="/preview" element={<ProtectedRoute><PreviewPage /></ProtectedRoute>} />
        <Route path="/chatbot" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
      </Routes>
    </Layout>
  )
}

export default App
