import { formatLevel, formatDuration, formatComponents, getSchoolTheme } from '../utils/spellUtils'

/* ── SVG Icon components ─────────────────────────── */
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const TargetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

const HourglassIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
    <path d="M5 22h14" /><path d="M5 2h14" />
    <path d="M17 2v4a6 6 0 0 1-5 5.92V14a6 6 0 0 1 5 5.92V22" />
    <path d="M7 2v4a6 6 0 0 0 5 5.92V14a6 6 0 0 0-5 5.92V22" />
  </svg>
)

const FlaskIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
    <path d="M9 3h6v7l4 9H5l4-9z" />
    <path d="M9 3v0" /><path d="M15 3v0" />
    <line x1="9" y1="10" x2="15" y2="10" />
  </svg>
)

/* ── Card dimensions (screen preview) ─────────────── */
// Poker card: 2.5" × 3.5" — display at ~2.5× for screen
const W = 250   // px on screen
const H = 350

export default function SpellCardFront({ spell, imageUrl, onImageClick }) {
  const theme = getSchoolTheme(spell.school)
  const levelLabel = formatLevel(spell.level, spell.school)
  const duration   = formatDuration(spell.duration, spell.concentration)
  const components = formatComponents(spell.components)

  const infoItems = [
    { icon: <ClockIcon />,    label: spell.casting_time || '—' },
    { icon: <TargetIcon />,   label: spell.range || '—' },
    { icon: <HourglassIcon />, label: duration },
    { icon: <FlaskIcon />,    label: components },
  ]

  return (
    <div className="spell-card-front" style={{ width: W, height: H, position: 'relative', flexShrink: 0 }}>
      {/* Outer border / frame */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: 14,
        background: 'linear-gradient(160deg, #5c3a1e 0%, #2e1a0a 40%, #3d2210 70%, #5a3018 100%)',
        boxShadow: '0 6px 24px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(180,130,70,0.25)',
      }} />

      {/* Inner frame inset */}
      <div style={{
        position: 'absolute', inset: 8,
        borderRadius: 9,
        border: '1.5px solid rgba(160,110,50,0.5)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* ── Name Banner ── */}
        <div style={{
          background: 'linear-gradient(180deg, #f5eed8 0%, #e8ddc2 100%)',
          padding: '5px 8px 4px',
          borderBottom: '1.5px solid rgba(90,56,20,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 11,
            fontWeight: 700,
            color: '#1a0a00',
            letterSpacing: '0.04em',
            textAlign: 'center',
            lineHeight: 1.2,
          }}>
            {spell.name}
          </span>
        </div>

        {/* ── Art Area ── */}
        <div style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          background: '#1a1008',
        }} onClick={onImageClick} title="Click to upload image">

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={spell.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            /* Placeholder art */
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: `radial-gradient(ellipse at center, ${theme.glow} 0%, #0d0804 70%)`,
            }}>
              <div style={{ fontSize: 32, opacity: 0.4, marginBottom: 6 }}>🎨</div>
              <div style={{
                fontFamily: 'EB Garamond, serif',
                fontSize: 9, color: 'rgba(200,170,120,0.6)',
                textAlign: 'center', padding: '0 8px',
              }}>
                Click to upload artwork
              </div>
            </div>
          )}

          {/* Level / School badge — sits at bottom of art */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(0deg, rgba(10,5,0,0.92) 0%, rgba(10,5,0,0.6) 70%, transparent 100%)',
            padding: '18px 8px 7px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 8.5,
              fontWeight: 600,
              color: '#c8a96e',
              letterSpacing: '0.06em',
              textShadow: '0 1px 4px rgba(0,0,0,0.8)',
            }}>
              {levelLabel}
            </span>
          </div>

          {/* Upload overlay hint (appears on hover via CSS class) */}
          {!imageUrl && null}
        </div>

        {/* ── Info Bar ── */}
        <div style={{
          background: 'linear-gradient(180deg, #1e0f05 0%, #150a02 100%)',
          borderTop: '1px solid rgba(160,110,50,0.3)',
          padding: '5px 6px 5px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 2,
          flexShrink: 0,
        }}>
          {infoItems.map((item, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              <div style={{ width: 12, height: 12, color: '#c8a96e', opacity: 0.9 }}>
                {item.icon}
              </div>
              <span style={{
                fontFamily: 'EB Garamond, serif',
                fontSize: 7.5,
                color: '#d4b896',
                textAlign: 'center',
                lineHeight: 1.2,
                maxWidth: 52,
                wordBreak: 'break-word',
              }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Corner ornaments */}
      <div style={{ position: 'absolute', top: 3, left: 3, width: 6, height: 6, borderTop: '1.5px solid rgba(180,140,70,0.6)', borderLeft: '1.5px solid rgba(180,140,70,0.6)', borderRadius: '3px 0 0 0' }} />
      <div style={{ position: 'absolute', top: 3, right: 3, width: 6, height: 6, borderTop: '1.5px solid rgba(180,140,70,0.6)', borderRight: '1.5px solid rgba(180,140,70,0.6)', borderRadius: '0 3px 0 0' }} />
      <div style={{ position: 'absolute', bottom: 3, left: 3, width: 6, height: 6, borderBottom: '1.5px solid rgba(180,140,70,0.6)', borderLeft: '1.5px solid rgba(180,140,70,0.6)', borderRadius: '0 0 0 3px' }} />
      <div style={{ position: 'absolute', bottom: 3, right: 3, width: 6, height: 6, borderBottom: '1.5px solid rgba(180,140,70,0.6)', borderRight: '1.5px solid rgba(180,140,70,0.6)', borderRadius: '0 0 3px 0' }} />
    </div>
  )
}
