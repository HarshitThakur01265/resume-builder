import { useEffect, useState } from 'react'
import { listResumes, deleteResume } from '../services/resumes'
import { Link } from 'react-router-dom'
import { ResumesListSkeleton } from '../components/Skeleton'
import LottieAnimation from '../components/LottieAnimation'
import loadingAnimation from '../assets/animations/loading.json'
import successAnimation from '../assets/animations/success.json'

export default function ResumesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [deletedId, setDeletedId] = useState(null)

  async function load() {
    try {
      setLoading(true)
      const data = await listResumes()
      setItems(data || [])
    } catch (error) {
      console.error('Error loading resumes:', error)
      if (error?.message?.includes('Not authenticated')) {
        // User not authenticated - this is handled by the app routing
        setItems([])
      } else {
        alert('Failed to load resumes: ' + (error?.message || 'Unknown error'))
        setItems([])
      }
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  const onDelete = async (id) => {
    if (!confirm('Delete this resume?')) return
    try {
      setDeletingId(id)
      await deleteResume(id)
      setDeletedId(id)
      setTimeout(() => {
        setDeletedId(null)
        load()
      }, 2000)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="page-glass-wrapper">
      <div className="glass-container glass-border" style={{ maxWidth: 900, padding: '40px', zIndex: 2, minHeight: '600px' }}>
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
            My Resumes
          </h2>
          <p style={{ color: 'var(--muted)', marginTop: '8px', fontSize: '16px' }}>
            Manage and preview your saved resumes
          </p>
        </div>

        {loading ? (
          <div style={{ padding: '20px 0' }}>
            <ResumesListSkeleton />
          </div>
        ) : items.length === 0 ? (
          <div className="glass-container" style={{ 
            textAlign: 'center', 
            padding: '60px', 
            background: 'rgba(255, 255, 255, 0.02)',
            border: '2px dashed rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ 
              fontSize: '48px', 
              opacity: 0.3, 
              marginBottom: '16px' 
            }}>📄</div>
            <h3 style={{ color: 'var(--text)', marginBottom: '12px' }}>No resumes yet</h3>
            <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
              Create your first resume using our editor
            </p>
            <Link to="/choose-profile">
              <button className="glass-button">
                Create Resume
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {items.map(item => (
              <div 
                key={item.id} 
                className={`glass-container ${deletedId === item.id ? 'deleting' : ''}`}
                style={{ 
                  padding: '24px',
                  background: deletedId === item.id 
                    ? 'rgba(34, 197, 94, 0.1)' 
                    : 'rgba(255, 255, 255, 0.03)',
                  border: deletedId === item.id 
                    ? '1px solid rgba(34, 197, 94, 0.3)' 
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      margin: '0 0 8px 0', 
                      color: 'var(--text)', 
                      fontSize: '18px', 
                      fontWeight: 600 
                    }}>
                      {deletedId === item.id ? (
                        <span style={{ color: 'rgba(34, 197, 94, 0.9)' }}>
                          ✅ Deleted Successfully
                        </span>
                      ) : (
                        item.title
                      )}
                    </h3>
                    <div style={{ 
                      color: 'var(--muted)', 
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>📅</span>
                      {new Date(item.created_at).toLocaleString()}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Link to={`/editor?id=${item.id}`}>
                      <button 
                        className="glass-button" 
                        disabled={deletedId === item.id}
                      >
                        ✏️ Edit
                      </button>
                    </Link>
                    <Link to={`/preview?id=${item.id}`}>
                      <button 
                        className="glass-button" 
                        disabled={deletedId === item.id}
                      >
                        👁️ Preview
                      </button>
                    </Link>
                    <button 
                      className="glass-button" 
                      onClick={() => onDelete(item.id)}
                      disabled={deletingId === item.id || deletedId === item.id}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderColor: 'rgba(239, 68, 68, 0.3)',
                        color: 'rgba(239, 68, 68, 0.9)'
                      }}
                      onMouseEnter={(e) => {
                        if (!e.target.disabled) {
                          e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.target.disabled) {
                          e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                        }
                      }}
                    >
                      {deletingId === item.id ? (
                        <LottieAnimation
                          animationData={loadingAnimation}
                          width={16}
                          height={16}
                          className="loading-animation"
                          loop={true}
                          autoplay={true}
                        />
                      ) : deletedId === item.id ? (
                        <>
                          <LottieAnimation
                            animationData={successAnimation}
                            width={16}
                            height={16}
                            className="success-animation"
                            loop={false}
                            autoplay={true}
                          />
                          <span style={{ marginLeft: '8px' }}>Deleted</span>
                        </>
                      ) : (
                        '🗑️ Delete'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <div style={{ marginTop: '40px', textAlign: 'center' }}>
              <Link to="/choose-profile">
                <button className="glass-button" style={{ fontSize: '16px', padding: '16px 32px' }}>
                  ➕ Create New Resume
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}