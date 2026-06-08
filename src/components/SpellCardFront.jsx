import { formatLevel, formatDuration, formatComponents, getSchoolTheme } from '../utils/spellUtils'

/* ── SVG Icons ───────────────────────────────────── */
const ClockIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)
const TargetIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
)
const HourglassIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 22h14M5 2h14" />
    <path d="M17 2v4a6 6 0 0 1-5 5.92V14a6 6 0 0 1 5 5.92V22" />
    <path d="M7 2v4a6 6 0 0 0 5 5.92V14a6 6 0 0 0-5 5.92V22" />
  </svg>
)
const FlaskIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3h6v7l4 9H5l4-9z" /><line x1="9" y1="10" x2="15" y2="10" />
  </svg>
)

/* ── Card dimensions ──────────────────────────────
   70mm × 120mm = 2.756" × 4.724" → 265×454px at 96dpi
   We use 280×480 for screen; print CSS scales to exact size.
─────────────────────────────────────────────────── */
const W = 280
const H = 480

export default function SpellCardFront({ spell, imageUrl, onImageClick }) {
  const theme = getSchoolTheme(spell.school)
  const levelLabel = formatLevel(spell.level, spell.school)
  const duration   = formatDuration(spell.duration, spell.concentration)
  const components = formatComponents(spell.components)

  const infoItems = [
    { icon: <ClockIcon />,     label: spell.casting_time || '—', title: 'Casting Time' },
    { icon: <TargetIcon />,    label: spell.range || '—',        title: 'Range' },
    { icon: <HourglassIcon />, label: duration,                  title: 'Duration' },
    { icon: <FlaskIcon />,     label: components,                title: 'Components' },
  ]

  return (
    <div
      className="spell-card-front"
      style={{
        width: W, height: H,
        position: 'relative',
        flexShrink: 0,
        borderRadius: 12,
        /* Ink-friendly: thin double-line border instead of filled dark frame */
        outline: '3px solid #3d2210',
        outlineOffset: '-3px',
        border: '1px solid #3d2210',
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
      }}
    >
      {/* Inner border line */}
      <div style={{
        position: 'absolute', inset: 5,
        border: '1px solid rgba(90,56,20,0.6)',
        borderRadius: 8,
        pointerEvents: 'none', zIndex: 10,
      }} />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>

        {/* ── Name Banner ── */}
        <div style={{
          background: '#fff',
          padding: '6px 10px 5px',
          borderBottom: '1px solid #3d2210',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, zIndex: 2,
        }}>
          <span style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 13,
            fontWeight: 700,
            color: '#1a0a00',
            letterSpacing: '0.03em',
            textAlign: 'center',
            lineHeight: 1.2,
          }}>
            {spell.name}
          </span>
        </div>

        {/* ── Art Area ── */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            background: imageUrl ? '#000' : '#f8f5ef',
          }}
          onClick={onImageClick}
          title="Click to upload artwork"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={spell.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 8,
              border: '2px dashed rgba(90,56,20,0.25)',
              margin: 0,
            }}>
              <div style={{ fontSize: 36, opacity: 0.25 }}>🎨</div>
              <div style={{
                fontFamily: 'EB Garamond, serif',
                fontSize: 10, color: 'rgba(90,56,20,0.5)',
                textAlign: 'center', padding: '0 12px',
              }}>
                Click to upload artwork
              </div>
            </div>
          )}

          {/* Level / School badge — light overlay at bottom of art */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'rgba(255,255,255,0.92)',
            borderTop: '1px solid rgba(90,56,20,0.4)',
            padding: '5px 8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 10,
              fontWeight: 700,
              color: '#3d2210',
              letterSpacing: '0.06em',
            }}>
              {levelLabel}
            </span>
          </div>
        </div>

        {/* ── Info Bar ── */}
        <div style={{
          background: '#fff',
          borderTop: '1.5px solid #3d2210',
          padding: '7px 6px 8px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 4,
          flexShrink: 0,
        }}>
          {infoItems.map((item, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            }}>
              <div style={{ color: '#3d2210', lineHeight: 0 }}>
                {item.icon}
              </div>
              <span style={{
                fontFamily: 'EB Garamond, serif',
                fontSize: 10,
                fontWeight: 700,
                color: '#1a0a00',
                textAlign: 'center',
                lineHeight: 1.25,
                wordBreak: 'break-word',
              }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Corner ornaments */}
      {[
        { top: 7, left: 7,  bt: '2px solid #3d2210', bl: '2px solid #3d2210', bb: 'none', br: 'none', radius: '3px 0 0 0' },
        { top: 7, right: 7, bt: '2px solid #3d2210', br: '2px solid #3d2210', bb: 'none', bl: 'none', radius: '0 3px 0 0' },
        { bottom: 7, left: 7,  bb: '2px solid #3d2210', bl: '2px solid #3d2210', bt: 'none', br: 'none', radius: '0 0 0 3px' },
        { bottom: 7, right: 7, bb: '2px solid #3d2210', br: '2px solid #3d2210', bt: 'none', bl: 'none', radius: '0 0 3px 0' },
      ].map((o, i) => (
        <div key={i} style={{
          position: 'absolute',
          ...(o.top !== undefined ? { top: o.top } : { bottom: o.bottom }),
          ...(o.left !== undefined ? { left: o.left } : { right: o.right }),
          width: 8, height: 8, zIndex: 11,
          borderTop: o.bt, borderLeft: o.bl, borderBottom: o.bb, borderRight: o.br,
          borderRadius: o.radius,
        }} />
      ))}
    </div>
  )
}
