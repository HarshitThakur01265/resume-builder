// Reusable SVG components: Paper, Pen, StarBadge, and a Composed StarResumeBadge
// All components accept: size (px), stroke (color), fill (color)

export function PaperIcon({ size = 64, stroke = '#0f172a', fill = '#ffffff' }) {
  const w = size
  const h = Math.round(size * 1.3)
  const r = Math.max(4, Math.round(size * 0.08))
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Paper">
      <rect x="2" y="2" rx={r} ry={r} width={w - 4} height={h - 4} fill={fill} stroke={stroke} strokeWidth="3" />
      <line x1={w * 0.14} y1={h * 0.2} x2={w * 0.64} y2={h * 0.2} stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <line x1={w * 0.14} y1={h * 0.34} x2={w * 0.78} y2={h * 0.34} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <line x1={w * 0.14} y1={h * 0.48} x2={w * 0.72} y2={h * 0.48} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <line x1={w * 0.14} y1={h * 0.62} x2={w * 0.66} y2={h * 0.62} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}

export function PenIcon({ size = 64, stroke = '#2563eb', fill = '#2563eb' }) {
  const w = size
  const h = size
  return (
    <svg width={w} height={h} viewBox="0 0 64 64" role="img" aria-label="Pen">
      <g transform="translate(8,8)">
        <rect x="0" y="22" width="36" height="6" rx="3" fill={fill} opacity="0.15" />
        <rect x="0" y="22" width="28" height="6" rx="3" fill={fill} />
        <polygon points="28,19 36,25 28,31" fill={fill} />
        <circle cx="6" cy="25" r="2.5" fill="#fff" opacity="0.9" />
      </g>
    </svg>
  )
}

export function StarBadge({ size = 88, stroke = '#f59e0b', fill = 'rgba(245,158,11,0.18)' }) {
  const s = size
  const spikes = 5
  const outer = s * 0.45
  const inner = s * 0.2
  const cx = s / 2
  const cy = s / 2
  let path = ''
  let rot = -Math.PI / 2
  for (let i = 0; i < spikes; i++) {
    const x1 = cx + Math.cos(rot) * outer
    const y1 = cy + Math.sin(rot) * outer
    rot += Math.PI / spikes
    const x2 = cx + Math.cos(rot) * inner
    const y2 = cy + Math.sin(rot) * inner
    rot += Math.PI / spikes
    path += `${i === 0 ? 'M' : 'L'} ${x1} ${y1} L ${x2} ${y2} `
  }
  path += 'Z'
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} role="img" aria-label="Star">
      <path d={path} fill={fill} stroke={stroke} strokeWidth="3" />
    </svg>
  )
}

// Composition: Paper on a star with a pen overlay (for featured resume actions)
export function StarResumeBadge({ size = 120 }) {
  const star = Math.round(size)
  const paper = Math.round(size * 0.5)
  const pen = Math.round(size * 0.5)
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent')?.trim() || '#2563eb'
  const text = getComputedStyle(document.documentElement).getPropertyValue('--text')?.trim() || '#0f172a'
  return (
    <div style={{ position: 'relative', width: star, height: star }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <StarBadge size={star} stroke={accent} fill='rgba(96,165,250,0.18)' />
      </div>
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -56%)' }}>
        <PaperIcon size={paper} stroke={text} fill="#ffffff" />
      </div>
      <div style={{ position: 'absolute', right: star * 0.08, bottom: star * 0.18, transform: 'rotate(-18deg)' }}>
        <PenIcon size={pen} />
      </div>
    </div>
  )
}

export default function ResumeIconsShowcase() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <StarResumeBadge size={120} />
      <PaperIcon />
      <PenIcon />
      <StarBadge />
    </div>
  )
}



