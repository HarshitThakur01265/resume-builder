import React from 'react'

const shimmer = 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%)'

export function SkeletonLine({ width = '100%', height = 14, style = {} }) {
  return (
    <div
      role="presentation"
      aria-hidden
      className="skeleton-line"
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height,
        borderRadius: 4,
        background: shimmer,
        backgroundSize: '200% 100%',
        animation: 'skeleton-shimmer 1.2s ease-in-out infinite',
        ...style
      }}
    />
  )
}

export function SkeletonCard({ lines = 3, style = {} }) {
  return (
    <div
      role="presentation"
      aria-hidden
      style={{
        padding: 20,
        borderRadius: 12,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        ...style
      }}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} width={i === 0 ? '60%' : i === lines - 1 ? '85%' : '100%'} />
      ))}
    </div>
  )
}

export function EditorLoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
        <SkeletonCard lines={4} />
        <SkeletonCard lines={4} />
      </div>
      <SkeletonCard lines={5} />
      <SkeletonCard lines={3} />
      <SkeletonCard lines={4} />
      <SkeletonCard lines={2} />
    </div>
  )
}

export function ResumesListSkeleton() {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          style={{
            padding: 24,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SkeletonLine width="70%" height={18} />
            <SkeletonLine width="40%" height={12} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <SkeletonLine width={64} height={36} style={{ borderRadius: 6 }} />
            <SkeletonLine width={64} height={36} style={{ borderRadius: 6 }} />
            <SkeletonLine width={64} height={36} style={{ borderRadius: 6 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function PreviewLoadingSkeleton() {
  return (
    <div
      className="pdf-page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        padding: 24
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SkeletonLine width="50%" height={24} />
        <SkeletonLine width="70%" height={14} />
      </div>
      <SkeletonLine width="100%" height={60} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <SkeletonCard lines={4} />
        <SkeletonCard lines={4} />
      </div>
      <SkeletonCard lines={6} />
    </div>
  )
}
