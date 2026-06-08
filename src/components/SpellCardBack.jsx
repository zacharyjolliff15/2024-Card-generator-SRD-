import { useEffect, useRef, useState } from 'react'
import {
  cleanDescription,
  formatLevel,
  formatDuration,
  formatComponents,
  splitDescription,
  getDescriptionHtml,
  sanitizeDescriptionHtml,
} from '../utils/spellUtils'

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

const descStyle = {
  fontFamily: 'EB Garamond, serif',
  fontSize: 9.5,
  color: '#1a0a00',
  lineHeight: 1.55,
  margin: 0,
  textAlign: 'justify',
  hyphens: 'auto',
}

function parseComponents(value) {
  return value
    .split(',')
    .map(part => part.trim())
    .filter(Boolean)
}

function applyFormat(command) {
  document.execCommand(command, false)
}

function handleEditorKeyDown(e) {
  const key = e.key.toLowerCase()
  if (!(e.metaKey || e.ctrlKey) || e.altKey) return

  if (key === 'b') {
    e.preventDefault()
    applyFormat('bold')
  } else if (key === 'i') {
    e.preventDefault()
    applyFormat('italic')
  }
}

function EditableField({ value, onChange, placeholder, style }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        border: '1px solid rgba(0,0,0,0.15)',
        borderRadius: 4,
        padding: '2px 4px',
        fontFamily: 'EB Garamond, serif',
        fontSize: 9.5,
        fontWeight: 700,
        color: '#1a0a00',
        textAlign: 'center',
        background: 'rgba(255,255,255,0.85)',
        ...style,
      }}
    />
  )
}

export default function SpellCardBack({ spell, classTheme, editable = false, onSave }) {
  const [isEditing, setIsEditing] = useState(false)
  const [saveState, setSaveState] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [draft, setDraft] = useState(null)
  const editorRef = useRef(null)

  const levelLabel = formatLevel(spell.level, spell.school)
  const duration = formatDuration(spell.duration, spell.concentration)
  const components = formatComponents(spell.components)
  const descriptionHtml = getDescriptionHtml(spell.description)
  const { body, higherLevels } = splitDescription(descriptionHtml)

  const infoItems = [
    { key: 'casting_time', icon: <ClockIcon />, label: spell.casting_time || '—' },
    { key: 'range', icon: <TargetIcon />, label: spell.range || '—' },
    { key: 'duration', icon: <HourglassIcon />, label: duration, rawDuration: spell.duration || '' },
    { key: 'components', icon: <FlaskIcon />, label: components },
  ]

  const cardBg = classTheme ? classTheme.light : '#fdf9f0'
  const accentColor = classTheme ? classTheme.accent : '#b07830'
  const iconColor = classTheme ? classTheme.accent : '#7a5020'
  const infoBg = classTheme ? classTheme.bg : 'rgba(180,140,60,0.06)'
  const cardBorder = classTheme
    ? `2px solid ${classTheme.accent}55`
    : '1px solid #e8e4de'

  useEffect(() => {
    if (isEditing && editorRef.current && draft) {
      editorRef.current.innerHTML = draft.descriptionHtml
    }
  }, [isEditing, draft])

  function startEdit() {
    setDraft({
      casting_time: spell.casting_time || '',
      range: spell.range || '',
      duration: spell.duration || '',
      components,
      material: spell.material || '',
      descriptionHtml,
    })
    setSaveState('idle')
    setErrorMessage('')
    setIsEditing(true)
  }

  function cancelEdit() {
    setIsEditing(false)
    setDraft(null)
    setSaveState('idle')
    setErrorMessage('')
  }

  async function handleSave() {
    if (!onSave || !editorRef.current || !draft) return

    const description = sanitizeDescriptionHtml(editorRef.current.innerHTML)
    const updates = {
      casting_time: draft.casting_time.trim() || null,
      range: draft.range.trim() || null,
      duration: draft.duration.trim() || null,
      components: parseComponents(draft.components),
      material: draft.material.trim() || null,
      description: description ? [description] : [''],
    }

    setSaveState('saving')
    setErrorMessage('')

    try {
      await onSave(spell.index, updates)
      setSaveState('saved')
      setIsEditing(false)
      setDraft(null)
      setTimeout(() => setSaveState('idle'), 1500)
    } catch (err) {
      setSaveState('error')
      setErrorMessage(err.message || 'Save failed')
    }
  }

  return (
    <div
      className="spell-card-back"
      style={{
        width: W,
        height: H,
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
      {classTheme && (
        <div style={{ height: 4, background: classTheme.accent, flexShrink: 0 }} />
      )}

      {editable && !isEditing && (
        <button
          type="button"
          className="screen-only spell-card-edit-btn"
          onClick={startEdit}
          title="Edit card back"
        >
          Edit
        </button>
      )}

      <div style={{ padding: classTheme ? '10px 14px 8px' : '14px 14px 8px', flexShrink: 0 }}>
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 15,
          fontWeight: 700,
          color: '#1a0a00',
          lineHeight: 1.3,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 6,
        }}>
          {spell.name}
          {spell.ritual && (
            <span style={{
              fontFamily: 'EB Garamond, serif',
              fontSize: 8.5,
              fontStyle: 'italic',
              color: '#9a7030',
              background: 'rgba(180,140,40,0.1)',
              borderRadius: 12,
              padding: '1px 6px',
            }}>
              Ritual
            </span>
          )}
        </div>
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 10,
          fontWeight: 600,
          color: accentColor,
          marginTop: 2,
          letterSpacing: '0.03em',
        }}>
          {levelLabel}
        </div>
      </div>

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
        {infoItems.map(item => (
          <div key={item.key} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            padding: '6px 0',
          }}>
            <div style={{ color: iconColor, lineHeight: 0 }}>{item.icon}</div>
            {isEditing && draft ? (
              <EditableField
                value={item.key === 'duration' ? draft.duration : draft[item.key]}
                onChange={value => setDraft(prev => ({
                  ...prev,
                  [item.key === 'duration' ? 'duration' : item.key]: value,
                }))}
                placeholder={item.key}
              />
            ) : (
              <span style={{
                fontFamily: 'EB Garamond, serif',
                fontSize: 10,
                fontWeight: 700,
                color: '#1a0a00',
                textAlign: 'center',
                lineHeight: 1.25,
                wordBreak: 'break-word',
              }}>
                {item.key === 'duration' ? duration : item.label}
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={{
        flex: 1,
        padding: '10px 14px 6px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        minHeight: 0,
      }}>
        {isEditing && draft ? (
          <>
            <div className="spell-edit-toolbar screen-only">
              <button type="button" onMouseDown={e => { e.preventDefault(); applyFormat('bold') }} title="Bold (⌘B)">
                <strong>B</strong>
              </button>
              <button type="button" onMouseDown={e => { e.preventDefault(); applyFormat('italic') }} title="Italic (⌘I)">
                <em>I</em>
              </button>
            </div>
            <div
              ref={editorRef}
              className="spell-card-description spell-card-editor"
              contentEditable
              suppressContentEditableWarning
              onKeyDown={handleEditorKeyDown}
              style={{
                ...descStyle,
                flex: 1,
                overflow: 'auto',
                outline: '1px solid rgba(0,0,0,0.12)',
                borderRadius: 6,
                padding: '6px 8px',
                background: 'rgba(255,255,255,0.7)',
              }}
            />
          </>
        ) : (
          <>
            {body ? (
              <div
                className="spell-card-description"
                style={descStyle}
                dangerouslySetInnerHTML={{ __html: body }}
              />
            ) : (
              <p style={descStyle}>{cleanDescription(spell.description)}</p>
            )}

            {higherLevels && (
              <div
                className="spell-card-description"
                style={descStyle}
                dangerouslySetInnerHTML={{ __html: higherLevels }}
              />
            )}
          </>
        )}
      </div>

      {(spell.material || (isEditing && draft)) && (
        <div style={{
          padding: '0 14px 5px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 5,
          flexShrink: 0,
        }}>
          <span style={{ color: accentColor, fontSize: 9, flexShrink: 0, marginTop: 1 }}>✦</span>
          {isEditing && draft ? (
            <input
              value={draft.material}
              onChange={e => setDraft(prev => ({ ...prev, material: e.target.value }))}
              placeholder="Material component"
              style={{
                flex: 1,
                border: '1px solid rgba(0,0,0,0.15)',
                borderRadius: 4,
                padding: '2px 6px',
                fontFamily: 'EB Garamond, serif',
                fontSize: 9,
                color: classTheme ? classTheme.accent : '#7a5020',
                fontStyle: 'italic',
                background: 'rgba(255,255,255,0.85)',
              }}
            />
          ) : (
            <span style={{
              fontFamily: 'EB Garamond, serif',
              fontSize: 9,
              color: classTheme ? classTheme.accent : '#7a5020',
              fontStyle: 'italic',
              lineHeight: 1.4,
            }}>
              {spell.material}
            </span>
          )}
        </div>
      )}

      {spell.classes?.length > 0 && (
        <div style={{ padding: '4px 8px 10px', textAlign: 'center', flexShrink: 0 }}>
          <span style={{
            fontFamily: 'EB Garamond, serif',
            fontSize: 9,
            fontWeight: 600,
            color: accentColor,
            letterSpacing: '0.02em',
          }}>
            ({spell.classes.join(', ')})
          </span>
        </div>
      )}

      {isEditing && (
        <div className="screen-only spell-card-edit-actions">
          <button type="button" className="spell-card-save-btn" onClick={handleSave} disabled={saveState === 'saving'}>
            {saveState === 'saving' ? 'Saving…' : 'Save'}
          </button>
          <button type="button" className="spell-card-cancel-btn" onClick={cancelEdit} disabled={saveState === 'saving'}>
            Cancel
          </button>
          {saveState === 'error' && (
            <span className="spell-card-save-error">{errorMessage}</span>
          )}
        </div>
      )}

      {saveState === 'saved' && !isEditing && (
        <div className="screen-only spell-card-saved-badge">Saved</div>
      )}
    </div>
  )
}
