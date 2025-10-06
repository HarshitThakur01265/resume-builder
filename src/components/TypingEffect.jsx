import { useEffect, useRef } from 'react'
import Typed from 'typed.js'

export default function TypingEffect({ 
  strings, 
  typeSpeed = 50, 
  backSpeed = 30, 
  loop = true,
  showCursor = true,
  className = '',
  onComplete = null 
}) {
  const el = useRef(null)
  const typed = useRef(null)

  useEffect(() => {
    const options = {
      strings: strings,
      typeSpeed: typeSpeed,
      backSpeed: backSpeed,
      loop: loop,
      showCursor: showCursor,
      onComplete: onComplete
    }

    typed.current = new Typed(el.current, options)

    return () => {
      typed.current?.destroy()
    }
  }, [strings, typeSpeed, backSpeed, loop, showCursor, onComplete])

  return (
    <div className={className}>
      <span ref={el} />
    </div>
  )
}
