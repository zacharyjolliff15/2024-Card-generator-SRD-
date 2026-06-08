import { cleanDescription, formatLevel, formatDuration, formatComponents, splitDescription } from '../utils/spellUtils'

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
const GemIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="M2 8.5h20M2 15.5h20" />
  </svg>
)

const W = 280
const H = 480

export default function SpellCardBack({ spell }) {
  const levelLabel  = formatLevel(spell.level, spell.school)
  const duration    = formatDuration(spell.duration, spell.concentration)
  const components  = formatComponents(spell.components)
  const rawDesc     = cleanDescription(spell.description)
  const { body, higherLevels, higherLevelsLabel } = splitDescription(rawDesc)

  const infoItems = [
    { icon: <ClockIcon />,     label: spell.casting_time || '—' },
    { icon: <TargetIcon />,    label: spell.range || '—' },
    { icon: <HourglassIcon />, label: duration },
    { icon: <FlaskIcon />,     label: components },
  ]

  return (
    <div
      className="spell-card-back"
      style={{
        width: W, height: H,
        position: 'relative',
        flexShrink: 0,
        borderRadius: 12,
        outline: '3px solid #3d2210',
        outlineOffset: '-3px',
        border: '1px solid #3d2210',
        overflow: 'hidden',
        background: '#fdf8ee',
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
      }}
    >
      {/* Inner border line */}
      <div style={{
        position: 'absolute', inset: 5,
        border: '1px solid rgba(90,56,20,0.5)',
        borderRadius: 8,
        pointerEvents: 'none', zIndex: 10,
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: '9px 12px 7px',
          borderBottom: '1.5px solid #3d2210',
          flexShrink: 0,
          background: '#fff',
        }}>
          <div style={{
            fontFamily: 'Cinzel, serif', fontSize: 14, fontWeight: 700,
            color: '#1a0a00', lineHeight: 1.3,
            display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4,
          }}>
            {spell.name}
            {spell.ritual && (
              <span style={{
                fontFamily: 'EB Garamond, serif', fontSize: 8,
                color: '#7a5820', letterSpacing: '0.06em',
                background: 'rgba(180,140,60,0.12)',
                border: '0.75px solid rgba(140,100,30,0.5)',
                borderRadius: 3, padding: '1px 5px',
              }}>✦ Ritual</span>
            )}
          </div>
          <div style={{
            fontFamily: 'Cinzel, serif', fontSize: 10, fontWeight: 600,
            color: '#7a5820', letterSpacing: '0.04em', marginTop: 2,
          }}>
            {levelLabel}
          </div>
        </div>

        {/* ── Info Row ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          padding: '8px 8px 7px',
          borderBottom: '1px solid rgba(61,34,16,0.3)',
          flexShrink: 0,
          background: '#fff',
          gap: 2,
        }}>
          {infoItems.map((item, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            }}>
              <div style={{ color: '#3d2210', lineHeight: 0 }}>{item.icon}</div>
              <span style={{
                fontFamily: 'EB Garamond, serif',
                fontSize: 10, fontWeight: 700,
                color: '#1a0a00', textAlign: 'center', lineHeight: 1.25,
                wordBreak: 'break-word',
              }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Description ── */}
        <div style={{
          flex: 1,
          padding: '8px 12px 6px',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column', gap: 5,
        }}>
          <p style={{
            fontFamily: 'EB Garamond, serif', fontSize: 9.5,
            color: '#1a0a00', lineHeight: 1.5,
            margin: 0, textAlign: 'justify', hyphens: 'auto',
          }}>
            {body}
          </p>

          {higherLevels && (
            <p style={{
              fontFamily: 'EB Garamond, serif', fontSize: 9.5,
              color: '#1a0a00', lineHeight: 1.5,
              margin: 0, textAlign: 'justify',
            }}>
              <strong style={{ fontStyle: 'italic' }}>{higherLevelsLabel}</strong>{' '}
              {higherLevels.replace(higherLevelsLabel, '').trim()}
            </p>
          )}
        </div>

        {/* ── Material ── */}
        {spell.material && (
          <div style={{
            borderTop: '1px solid rgba(61,34,16,0.3)',
            padding: '5px 12px',
            display: 'flex', alignItems: 'center', gap: 6,
            flexShrink: 0,
            background: '#fdf8ee',
          }}>
            <div style={{ color: '#7a5820', flexShrink: 0 }}><GemIcon /></div>
            <span style={{
              fontFamily: 'EB Garamond, serif', fontSize: 9,
              color: '#5a3820', fontStyle: 'italic', lineHeight: 1.3,
            }}>
              {spell.material}
            </span>
          </div>
        )}

        {/* ── Classes ── */}
        {spell.classes?.length > 0 && (
          <div style={{
            borderTop: '1px solid rgba(61,34,16,0.25)',
            padding: '5px 8px',
            textAlign: 'center',
            flexShrink: 0,
            background: '#fdf8ee',
          }}>
            <span style={{
              fontFamily: 'EB Garamond, serif', fontSize: 9, fontWeight: 600,
              color: '#3d2210',
            }}>
              ({spell.classes.join(', ')})
            </span>
          </div>
        )}
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
