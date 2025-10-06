import React from 'react'
import Lottie from 'lottie-react'

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
  const defaultOptions = {
    loop,
    autoplay,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid meet'
    }
  }

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
      <Lottie
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
    </div>
  )
}

export default LottieAnimation

