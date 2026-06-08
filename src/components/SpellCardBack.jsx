import { cleanDescription, formatLevel, formatDuration, formatComponents, splitDescription } from '../utils/spellUtils'

/* ── SVG Icons ───────────────────────────────────── */
const ClockIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)
const TargetIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
)
const HourglassIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 22h14M5 2h14" />
    <path d="M17 2v4a6 6 0 0 1-5 5.92V14a6 6 0 0 1 5 5.92V22" />
    <path d="M7 2v4a6 6 0 0 0 5 5.92V14a6 6 0 0 0-5 5.92V22" />
  </svg>
)
const FlaskIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3h6v7l4 9H5l4-9z" /><line x1="9" y1="10" x2="15" y2="10" />
  </svg>
)

const W = 280
const H = 480

export default function SpellCardBack({ spell, classTheme }) {
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

  // Class theme — fall back to defaults
  const cardBg      = classTheme ? classTheme.light  : '#fdf9f0'
  const accentColor = classTheme ? classTheme.accent  : '#b07830'
  const iconColor   = classTheme ? classTheme.accent  : '#7a5020'
  const infoBg      = classTheme ? classTheme.bg      : 'rgba(180,140,60,0.06)'
  const cardBorder  = classTheme
    ? `2px solid ${classTheme.accent}55`
    : '1px solid #e8e4de'

  return (
    <div
      className="spell-card-back"
      style={{
        width: W, height: H,
        position: 'relative',
        flexShrink: 0,
        borderRadius: 14,
        background: cardBg,
        boxShadow: '0 4px 18px rgba(0,0,0,0.16), 0 1px 4px rgba(0,0,0,0.08)',
        border: cardBorder,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Top class color strip ── */}
      {classTheme && (
        <div style={{
          height: 4,
          background: classTheme.accent,
          flexShrink: 0,
        }} />
      )}

      {/* ── Header block ── */}
      <div style={{ padding: classTheme ? '10px 14px 8px' : '14px 14px 8px', flexShrink: 0 }}>
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 15, fontWeight: 700,
          color: '#1a0a00', lineHeight: 1.3,
          display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6,
        }}>
          {spell.name}
          {spell.ritual && (
            <span style={{
              fontFamily: 'EB Garamond, serif', fontSize: 8.5,
              fontStyle: 'italic', color: '#9a7030',
              background: 'rgba(180,140,40,0.1)',
              borderRadius: 12, padding: '1px 6px',
            }}>
              Ritual
            </span>
          )}
        </div>
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 10, fontWeight: 600,
          color: accentColor,
          marginTop: 2,
          letterSpacing: '0.03em',
        }}>
          {levelLabel}
        </div>
      </div>

      {/* ── Info row ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        padding: '4px 10px 10px',
        gap: 2,
        flexShrink: 0,
        background: infoBg,
        margin: '0 10px',
        borderRadius: 8,
      }}>
        {infoItems.map((item, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, padding: '6px 0',
          }}>
            <div style={{ color: iconColor, lineHeight: 0 }}>{item.icon}</div>
            <span style={{
              fontFamily: 'EB Garamond, serif',
              fontSize: 10, fontWeight: 700,
              color: '#1a0a00', textAlign: 'center',
              lineHeight: 1.25, wordBreak: 'break-word',
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Description ── */}
      <div style={{
        flex: 1,
        padding: '10px 14px 6px',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        <p style={{
          fontFamily: 'EB Garamond, serif', fontSize: 9.5,
          color: '#1a0a00', lineHeight: 1.55,
          margin: 0, textAlign: 'justify', hyphens: 'auto',
        }}>
          {body}
        </p>

        {higherLevels && (
          <p style={{
            fontFamily: 'EB Garamond, serif', fontSize: 9.5,
            color: '#1a0a00', lineHeight: 1.55,
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
          padding: '0 14px 5px',
          display: 'flex', alignItems: 'flex-start', gap: 5,
          flexShrink: 0,
        }}>
          <span style={{ color: accentColor, fontSize: 9, flexShrink: 0, marginTop: 1 }}>✦</span>
          <span style={{
            fontFamily: 'EB Garamond, serif', fontSize: 9,
            color: classTheme ? classTheme.accent : '#7a5020',
            fontStyle: 'italic', lineHeight: 1.4,
          }}>
            {spell.material}
          </span>
        </div>
      )}

      {/* ── Classes ── */}
      {spell.classes?.length > 0 && (
        <div style={{
          padding: '4px 8px 10px',
          textAlign: 'center',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'EB Garamond, serif', fontSize: 9, fontWeight: 600,
            color: accentColor, letterSpacing: '0.02em',
          }}>
            ({spell.classes.join(', ')})
          </span>
        </div>
      )}
    </div>
  )
}
