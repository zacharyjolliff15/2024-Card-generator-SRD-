import { useState, useEffect } from 'react'
import { formatLevel, formatDuration, formatComponents } from '../utils/spellUtils'

/* ── SVG Icons ───────────────────────────────────── */
const ClockIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)
const TargetIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
)
const HourglassIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 22h14M5 2h14" />
    <path d="M17 2v4a6 6 0 0 1-5 5.92V14a6 6 0 0 1 5 5.92V22" />
    <path d="M7 2v4a6 6 0 0 0 5 5.92V14a6 6 0 0 0-5 5.92V22" />
  </svg>
)
const FlaskIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3h6v7l4 9H5l4-9z" /><line x1="9" y1="10" x2="15" y2="10" />
  </svg>
)

/* ── Layout ──────────────────────────────────────────
   Card:        280 × 480 px  (prints at 70 mm × 120 mm)
   White frame: 10 px thick white border around image
   Info bar:    56 px at bottom (compact)
   Image top:   15 px from card top
   Image side:  0  — frame fills full card width
──────────────────────────────────────────────────── */
const W              = 280
const H              = 480
const INFO_H         = 56
const IMG_TOP        = 15
const IMG_PAD        = 10
const IMG_SIDE       = 0
const NAME_BANNER_TOP = 8

export default function SpellCardFront({ spell, imageUrl, onImageClick, classTheme }) {
  const [srcFailed, setSrcFailed] = useState(false)
  useEffect(() => { setSrcFailed(false) }, [imageUrl])

  const showImage = Boolean(imageUrl) && !srcFailed

  const levelLabel = formatLevel(spell.level, spell.school)
  const duration   = formatDuration(spell.duration, spell.concentration)
  const components = formatComponents(spell.components)

  const infoItems = [
    { icon: <ClockIcon />,     label: spell.casting_time || '—' },
    { icon: <TargetIcon />,    label: spell.range || '—' },
    { icon: <HourglassIcon />, label: duration },
    { icon: <FlaskIcon />,     label: components },
  ]

  // Class theme — fall back to defaults when no theme provided
  const infoBg     = classTheme ? classTheme.bg     : '#f7f4ef'
  const iconColor  = classTheme ? classTheme.accent  : '#5a3820'
  const itemColor  = classTheme ? classTheme.accent  : '#1a0a00'
  const levelColor = classTheme ? classTheme.accent  : '#3d2210'
  const nameBg     = classTheme ? classTheme.light   : '#ffffff'
  const cardBorder = classTheme
    ? `2px solid ${classTheme.accent}55`
    : '1px solid #e8e4de'
  const gradientBg = classTheme
    ? `linear-gradient(to top, ${classTheme.light} 55%, transparent 100%)`
    : 'linear-gradient(to top, rgba(255,255,255,0.96) 60%, transparent 100%)'

  return (
    <div
      className="spell-card-front"
      style={{
        width: W, height: H,
        position: 'relative',
        flexShrink: 0,
        borderRadius: 14,
        background: '#ffffff',
        boxShadow: '0 4px 18px rgba(0,0,0,0.16), 0 1px 4px rgba(0,0,0,0.08)',
        border: cardBorder,
        overflow: 'hidden',
      }}
    >

      {/* ── Top class color strip (visible when classTheme is active) ── */}
      {classTheme && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 4,
          background: classTheme.accent,
          zIndex: 6,
        }} />
      )}

      {/* ── Image frame ── */}
      <div
        onClick={onImageClick}
        title="Click to upload artwork"
        style={{
          position: 'absolute',
          left: IMG_SIDE,
          right: IMG_SIDE,
          top: IMG_TOP,
          bottom: INFO_H,
          background: '#ffffff',
          borderRadius: 14,
          cursor: 'pointer',
        }}
      >
        <div style={{
          position: 'absolute',
          inset: IMG_PAD,
          borderRadius: 8,
          overflow: 'hidden',
          background: imageUrl ? '#111' : '#f0ece4',
        }}>

          {showImage ? (
            <img
              src={imageUrl}
              alt={spell.name}
              onError={() => setSrcFailed(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 10,
            }}>
              <span style={{ fontSize: 40, opacity: 0.18 }}>🎨</span>
              <span style={{
                fontFamily: 'EB Garamond, serif',
                fontSize: 10.5,
                color: 'rgba(61,34,16,0.4)',
                textAlign: 'center',
                padding: '0 16px',
              }}>
                Click to upload artwork
              </span>
            </div>
          )}

          {/* Level / School — fades up from bottom of image */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            background: gradientBg,
            padding: '22px 10px 7px',
            textAlign: 'center',
          }}>
            <span style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 10,
              fontWeight: 700,
              color: levelColor,
              letterSpacing: '0.07em',
            }}>
              {levelLabel}
            </span>
          </div>

        </div>
      </div>

      {/* ── Name banner ── */}
      <div style={{
        position: 'absolute',
        top: NAME_BANNER_TOP,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 8,
        background: nameBg,
        borderRadius: 8,
        padding: '7px 20px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.1)',
        maxWidth: W - (IMG_SIDE * 2) - 8,
        textAlign: 'center',
        borderBottom: classTheme ? `3px solid ${classTheme.accent}` : 'none',
      }}>
        <span style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 15,
          fontWeight: 700,
          color: '#1a0a00',
          letterSpacing: '0.04em',
          lineHeight: 1.2,
          display: 'block',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {spell.name}
        </span>
      </div>

      {/* ── Info bar ── */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0, bottom: 0,
        height: INFO_H,
        background: infoBg,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        alignItems: 'center',
        padding: '4px 4px 5px',
        gap: 2,
        zIndex: 2,
      }}>
        {infoItems.map((item, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          }}>
            <div style={{ color: iconColor, lineHeight: 0 }}>{item.icon}</div>
            <span style={{
              fontFamily: 'EB Garamond, serif',
              fontSize: 9,
              fontWeight: 700,
              color: itemColor,
              textAlign: 'center',
              lineHeight: 1.2,
              wordBreak: 'break-word',
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}
