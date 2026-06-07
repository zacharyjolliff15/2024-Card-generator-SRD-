import { cleanDescription, formatLevel, formatDuration, formatComponents, splitDescription } from '../utils/spellUtils'

/* ── SVG Icon components ─────────────────────────── */
const ClockIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)
const TargetIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
)
const HourglassIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 22h14" /><path d="M5 2h14" />
    <path d="M17 2v4a6 6 0 0 1-5 5.92V14a6 6 0 0 1 5 5.92V22" />
    <path d="M7 2v4a6 6 0 0 0 5 5.92V14a6 6 0 0 0-5 5.92V22" />
  </svg>
)
const FlaskIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3h6v7l4 9H5l4-9z" /><line x1="9" y1="10" x2="15" y2="10" />
  </svg>
)
const MaterialIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    <path d="M12 6v6l4 2" />
  </svg>
)

/* ── Ritual badge ──────────────────────────────────── */
const RitualBadge = () => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 2,
    fontFamily: 'EB Garamond, serif', fontSize: 7,
    color: '#7a5820', letterSpacing: '0.04em',
    background: 'rgba(180,140,60,0.15)',
    border: '0.5px solid rgba(180,140,60,0.4)',
    borderRadius: 3, padding: '1px 4px',
    marginLeft: 4,
  }}>
    ✦ Ritual
  </span>
)

const W = 250
const H = 350

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
    <div className="spell-card-back" style={{ width: W, height: H, position: 'relative', flexShrink: 0 }}>

      {/* Outer border */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: 14,
        background: 'linear-gradient(160deg, #5c3a1e 0%, #2e1a0a 40%, #3d2210 70%, #5a3018 100%)',
        boxShadow: '0 6px 24px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(180,130,70,0.25)',
      }} />

      {/* Inner card surface — parchment */}
      <div style={{
        position: 'absolute', inset: 8,
        borderRadius: 9,
        border: '1px solid rgba(90,56,20,0.5)',
        background: 'linear-gradient(170deg, #f5eed8 0%, #ece3c5 50%, #f0e8cc 100%)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>

        {/* ── Header ── */}
        <div style={{ padding: '7px 9px 5px', borderBottom: '1px solid rgba(90,56,20,0.2)', flexShrink: 0 }}>
          <div style={{
            fontFamily: 'Cinzel, serif', fontSize: 11, fontWeight: 700,
            color: '#1a0a00', lineHeight: 1.3,
            display: 'flex', alignItems: 'center',
          }}>
            {spell.name}
            {spell.ritual && <RitualBadge />}
          </div>
          <div style={{
            fontFamily: 'EB Garamond, serif', fontSize: 9, fontWeight: 500,
            color: '#7a5820', letterSpacing: '0.04em', marginTop: 1,
          }}>
            {levelLabel}
          </div>
        </div>

        {/* ── Icon Info Row ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          padding: '6px 6px 5px',
          borderBottom: '1px solid rgba(90,56,20,0.2)',
          flexShrink: 0,
          gap: 2,
        }}>
          {infoItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <div style={{ color: '#5a3820', opacity: 0.8 }}>{item.icon}</div>
              <span style={{
                fontFamily: 'EB Garamond, serif', fontSize: 7.5,
                color: '#3a2010', textAlign: 'center', lineHeight: 1.25,
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
          padding: '6px 9px 4px',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <p style={{
            fontFamily: 'EB Garamond, serif', fontSize: 8.2,
            color: '#1a0a00', lineHeight: 1.45,
            margin: 0, textAlign: 'justify',
            hyphens: 'auto',
          }}>
            {body}
          </p>

          {higherLevels && (
            <p style={{
              fontFamily: 'EB Garamond, serif', fontSize: 8.2,
              color: '#1a0a00', lineHeight: 1.45,
              margin: 0, textAlign: 'justify',
            }}>
              <em><strong style={{ fontStyle: 'normal' }}>{higherLevelsLabel}</strong></em>{' '}
              {higherLevels.replace(higherLevelsLabel, '').trim()}
            </p>
          )}
        </div>

        {/* ── Material ── */}
        {spell.material && (
          <div style={{
            borderTop: '1px solid rgba(90,56,20,0.25)',
            padding: '4px 9px',
            display: 'flex', alignItems: 'center', gap: 5,
            flexShrink: 0,
          }}>
            <div style={{ color: '#7a5820', flexShrink: 0 }}><MaterialIcon size={10} /></div>
            <span style={{
              fontFamily: 'EB Garamond, serif', fontSize: 7.5,
              color: '#5a3820', fontStyle: 'italic',
              lineHeight: 1.3,
            }}>
              {spell.material}
            </span>
          </div>
        )}

        {/* ── Classes ── */}
        {spell.classes?.length > 0 && (
          <div style={{
            borderTop: '1px solid rgba(90,56,20,0.2)',
            padding: '4px 6px',
            textAlign: 'center',
            flexShrink: 0,
          }}>
            <span style={{
              fontFamily: 'EB Garamond, serif', fontSize: 7.5,
              color: '#5a3820',
            }}>
              ({spell.classes.join(', ')})
            </span>
          </div>
        )}
      </div>

      {/* Corner ornaments */}
      <div style={{ position: 'absolute', top: 3, left: 3, width: 6, height: 6, borderTop: '1.5px solid rgba(180,140,70,0.6)', borderLeft: '1.5px solid rgba(180,140,70,0.6)', borderRadius: '3px 0 0 0' }} />
      <div style={{ position: 'absolute', top: 3, right: 3, width: 6, height: 6, borderTop: '1.5px solid rgba(180,140,70,0.6)', borderRight: '1.5px solid rgba(180,140,70,0.6)', borderRadius: '0 3px 0 0' }} />
      <div style={{ position: 'absolute', bottom: 3, left: 3, width: 6, height: 6, borderBottom: '1.5px solid rgba(180,140,70,0.6)', borderLeft: '1.5px solid rgba(180,140,70,0.6)', borderRadius: '0 0 0 3px' }} />
      <div style={{ position: 'absolute', bottom: 3, right: 3, width: 6, height: 6, borderBottom: '1.5px solid rgba(180,140,70,0.6)', borderRight: '1.5px solid rgba(180,140,70,0.6)', borderRadius: '0 0 3px 0' }} />
    </div>
  )
}
