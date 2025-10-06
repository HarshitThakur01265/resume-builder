import { useEffect, useRef } from 'react'

/**
 * MagicClick renders a global overlay that spawns a ripple and floating particles
 * at the pointer location on click/tap. It auto-cleans created elements.
 */
export default function MagicClick() {
  const overlayRef = useRef(null)

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    const handleClick = (e) => {
      // Respect reduced motion
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const x = e.clientX
      const y = e.clientY

      // Ripple effect
      const ripple = document.createElement('div')
      ripple.className = 'magic-ripple'
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`
      overlay.appendChild(ripple)
      ripple.addEventListener('animationend', () => ripple.remove())

      if (prefersReduced) return

      // Particles
      const particleCount = 12
      for (let i = 0; i < particleCount; i += 1) {
        const p = document.createElement('div')
        p.className = 'magic-particle'
        p.style.left = `${x}px`
        p.style.top = `${y}px`
        // Randomize travel
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.6
        const distance = 40 + Math.random() * 60
        const dx = Math.cos(angle) * distance
        const dy = Math.sin(angle) * distance
        p.style.setProperty('--dx', `${dx}px`)
        p.style.setProperty('--dy', `${dy}px`)
        p.style.setProperty('--rotate', `${(Math.random() * 360) | 0}deg`)
        overlay.appendChild(p)
        p.addEventListener('animationend', () => p.remove())
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <div
      ref={overlayRef}
      className="magic-overlay"
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}
    />
  )
}


