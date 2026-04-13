import React from 'react'
import * as LottieModule from 'lottie-react'

const LottieComponent =
  LottieModule?.default?.default ||
  LottieModule?.default ||
  LottieModule?.Lottie

const LottieAnimation = ({ 
  animationData, 
  loop = true, 
  autoplay = true, 
  speed = 1,
  width = 200, 
  height = 200,
  className = '',
  style = {},
  onComplete = null,
  onLoopComplete = null,
  ...props 
}) => {
  // defaultOptions removed (unused) to satisfy linter

  const handleComplete = () => {
    if (onComplete) {
      onComplete()
    }
  }

  const handleLoopComplete = () => {
    if (onLoopComplete) {
      onLoopComplete()
    }
  }

  return (
    <div 
      className={`lottie-container ${className}`}
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style 
      }}
      {...props}
    >
      {LottieComponent ? (
        <LottieComponent
          animationData={animationData}
          loop={loop}
          autoplay={autoplay}
          speed={speed}
          onComplete={handleComplete}
          onLoopComplete={handleLoopComplete}
          style={{
            width: '100%',
            height: '100%'
          }}
        />
      ) : null}
    </div>
  )
}

export default LottieAnimation

