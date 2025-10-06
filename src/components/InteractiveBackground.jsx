import { useEffect, useRef } from 'react'

// Lightweight particles + parallax background
// - Renders to a full-viewport canvas behind content
// - Particles gently float; mouse moves background with parallax
export default function InteractiveBackground() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const parallaxRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef([])
  const rafRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })

    const resize = () => {
      const ratio = window.devicePixelRatio || 1
      canvas.width = Math.floor(window.innerWidth * ratio)
      canvas.height = Math.floor(window.innerHeight * ratio)
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const kinds = ['sheet', 'pen', 'star']
    const createParticles = () => {
      const count = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 20000))
      particlesRef.current = Array.from({ length: count }).map((_, i) => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: 1.5 + Math.random() * 2.0,
        kind: i % 6 === 0 ? kinds[Math.floor(Math.random() * kinds.length)] : 'dot',
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.002
      }))
    }

    const onMouseMove = (e) => {
      mouseRef.current.x = e.clientX / window.innerWidth - 0.5
      mouseRef.current.y = e.clientY / window.innerHeight - 0.5
    }

    const onScroll = () => {
      // Subtle parallax with scroll
      const t = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight)
      parallaxRef.current.y = (t - 0.5) * 10
    }

    const drawSheet = (x, y, color) => {
      // Simple "resume" sheet icon (rounded rectangle + header line)
      ctx.save()
      ctx.translate(x, y)
      ctx.beginPath()
      const w = 12, h = 16, r = 2
      ctx.fillStyle = color
      ctx.moveTo(-w/2 + r, -h/2)
      ctx.arcTo(w/2, -h/2, w/2, h/2, r)
      ctx.arcTo(w/2, h/2, -w/2, h/2, r)
      ctx.arcTo(-w/2, h/2, -w/2, -h/2, r)
      ctx.arcTo(-w/2, -h/2, w/2, -h/2, r)
      ctx.closePath()
      ctx.globalAlpha = 0.08
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.strokeStyle = color
      ctx.lineWidth = 0.6
      ctx.stroke()
      // header line
      ctx.beginPath()
      ctx.moveTo(-w/2 + 2.5, -h/2 + 3)
      ctx.lineTo(-w/2 + 8, -h/2 + 3)
      ctx.stroke()
      ctx.restore()
    }

    const drawPen = (x, y, color, rot = 0) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rot)
      ctx.strokeStyle = color
      ctx.fillStyle = color
      ctx.globalAlpha = 0.12
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(-8, 0)
      ctx.lineTo(8, 0)
      ctx.stroke()
      ctx.globalAlpha = 1
      // nib triangle
      ctx.beginPath()
      ctx.moveTo(8, 0)
      ctx.lineTo(4, -3)
      ctx.lineTo(4, 3)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    const drawStar = (x, y, color, rot = 0) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rot)
      const spikes = 5
      const outerRadius = 6
      const innerRadius = 2.5
      let rotA = Math.PI / 2 * 3
      let cx = 0
      let cy = 0
      ctx.beginPath()
      ctx.moveTo(cx, cy - outerRadius)
      for (let i = 0; i < spikes; i++) {
        cx = Math.cos(rotA) * outerRadius
        cy = Math.sin(rotA) * outerRadius
        ctx.lineTo(cx, cy)
        rotA += Math.PI / spikes
        cx = Math.cos(rotA) * innerRadius
        cy = Math.sin(rotA) * innerRadius
        ctx.lineTo(cx, cy)
        rotA += Math.PI / spikes
      }
      ctx.closePath()
      ctx.strokeStyle = color
      ctx.globalAlpha = 0.5
      ctx.stroke()
      ctx.globalAlpha = 0.15
      ctx.fillStyle = color
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.restore()
    }

    const animate = () => {
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#60a5fa'
      const text = getComputedStyle(document.documentElement).getPropertyValue('--text') || '#e2e8f0'
      const theme = document.documentElement.getAttribute('data-theme') || 'dark'
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Parallax background tint
      const px = mouseRef.current.x * 10
      const py = mouseRef.current.y * 10 + parallaxRef.current.y

      ctx.save()
      ctx.translate(px, py)

      // Draw connecting lines subtly
      const parts = particlesRef.current
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < -20) p.x = window.innerWidth + 20
        if (p.x > window.innerWidth + 20) p.x = -20
        if (p.y < -20) p.y = window.innerHeight + 20
        if (p.y > window.innerHeight + 20) p.y = -20
      }

      // lines
      ctx.strokeStyle = text.trim() || '#e2e8f0'
      ctx.globalAlpha = theme === 'light' ? 0.08 : 0.06
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const dx = parts[i].x - parts[j].x
          const dy = parts[i].y - parts[j].y
          const d2 = dx * dx + dy * dy
          if (d2 < 140 * 140) {
            ctx.beginPath()
            ctx.moveTo(parts[i].x, parts[i].y)
            ctx.lineTo(parts[j].x, parts[j].y)
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1

      // particles
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i]
        p.rot += p.rotV
        if (p.kind === 'sheet') {
          drawSheet(p.x, p.y, accent.trim() || '#60a5fa')
        } else if (p.kind === 'pen') {
          drawPen(p.x, p.y, accent.trim() || '#60a5fa', p.rot)
        } else if (p.kind === 'star') {
          drawStar(p.x, p.y, accent.trim() || '#60a5fa', p.rot)
        } else {
          ctx.beginPath()
          ctx.fillStyle = text.trim() || '#e2e8f0'
          ctx.globalAlpha = theme === 'light' ? 0.25 : 0.3
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1
        }
      }
      ctx.restore()

      rafRef.current = requestAnimationFrame(animate)
    }

    resize()
    createParticles()
    animate()

    window.addEventListener('resize', () => { resize(); createParticles() })
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 1
      }}
    />
  )
}


