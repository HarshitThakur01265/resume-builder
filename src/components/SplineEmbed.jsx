import { useEffect, useRef, useState } from 'react'

export default function SplineEmbed({ sceneUrl, height = 320 }) {
  const containerRef = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      el.style.transform = `rotateX(${y * -6}deg) rotateY(${x * 6}deg)`
    }
    const handleLeave = () => {
      el.style.transform = 'rotateX(0deg) rotateY(0deg)'
    }
    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  const isPlaceholder = !sceneUrl || /placeholder|untitled-3dscene-placeholder/i.test(sceneUrl)

  return (
    <div style={{ perspective: '900px' }}>
      <div
        ref={containerRef}
        style={{
          height,
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.06), rgba(147, 51, 234, 0.06))',
          transition: 'transform 200ms ease'
        }}
      >
        {!failed && !isPlaceholder ? (
          <iframe
            title="3D Resume"
            src={sceneUrl}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            allow="accelerometer; autoplay; clipboard-write; gyroscope; xr-spatial-tracking"
            onError={() => setFailed(true)}
          />
        ) : (
          <div style={{ height: '100%', position: 'relative' }}>
            <style>{`
              @keyframes float3d { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-6px) } }
            `}</style>
            <div style={{
              position: 'absolute', inset: 0, display: 'grid', placeItems: 'center'
            }}>
              <div style={{
                width: 220,
                height: 150,
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                border: '1px solid rgba(0,0,0,0.08)',
                transform: 'rotateX(12deg) rotateY(-10deg)',
                animation: 'float3d 3.8s ease-in-out infinite',
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', top: 12, left: 12, width: '70%', height: 10, background: '#e5e7eb', borderRadius: 4 }} />
                <div style={{ position: 'absolute', top: 32, left: 12, width: '60%', height: 8, background: '#eef2f7', borderRadius: 4 }} />
                <div style={{ position: 'absolute', top: 52, left: 12, width: '78%', height: 8, background: '#eef2f7', borderRadius: 4 }} />
                <div style={{ position: 'absolute', bottom: 12, right: 12, padding: '4px 8px', border: '2px solid #16a34a', color: '#16a34a', borderRadius: 6, fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>Demo</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


