/**
 * Strip HTML tags from a string
 */
export function stripHtml(str) {
  return str.replace(/<[^>]*>/g, '').trim()
}

/**
 * Clean the description field. Some spells embed their metadata at the start
 * of the description text (Level X School ... Duration: X <actual text>).
 * This strips that prefix so only the actual spell description remains.
 */
export function cleanDescription(descArray) {
  if (!descArray?.length) return ''
  const raw = descArray.map(stripHtml).join('\n\n').trim()

  // If description starts with embedded metadata prefix, strip it
  if (/^(Level \d+|Cantrip)\s/i.test(raw)) {
    const durIdx = raw.indexOf('Duration: ')
    if (durIdx !== -1) {
      const afterDur = raw.slice(durIdx + 10)
      // Duration value ends before the first capital-letter sentence start
      // e.g. "8 hours You set..." or "Concentration, up to 1 hour You alter..."
      const match = afterDur.match(/^.+?\s+(?=[A-Z][a-z])/s)
      if (match) {
        return afterDur.slice(match[0].length).trim()
      }
    }
  }

  return raw
}

/**
 * Format the duration for display on the card info bar.
 * Concentration spells get "C. X min." style.
 */
export function formatDuration(duration, concentration) {
  if (!duration) return '—'
  if (concentration) {
    const m = duration.match(/up to (.+)/i)
    if (m) {
      return 'C. ' + m[1]
        .replace(/\bminutes?\b/gi, 'min.')
        .replace(/\bhours?\b/gi, 'hr.')
        .replace(/\brounds?\b/gi, 'rnd.')
    }
    return 'Conc.'
  }
  return duration
    .replace(/\bInstantaneous\b/gi, 'Instant')
    .replace(/\bminutes?\b/gi, 'min.')
    .replace(/\bhours?\b/gi, 'hr.')
    .replace(/\bdays?\b/gi, 'day')
    .replace(/\bUntil dispelled\b/gi, 'Permanent')
}

/**
 * Format the level label for display.
 * Level 0 = Cantrip, others = "Level X"
 */
export function formatLevel(level, school) {
  const lvl = level === 0 ? 'Cantrip' : `Level ${level}`
  return school ? `${lvl} – ${school}` : lvl
}

/**
 * Format components array for display, e.g. ["V","S","M"] → "V, S, M"
 */
export function formatComponents(components) {
  if (!components?.length) return '—'
  return components.join(', ')
}

/**
 * Split description into main body and "higher levels" section (if any).
 * Returns { body: string, higherLevels: string | null }
 */
export function splitDescription(description) {
  const patterns = [
    /\s*(Using a Higher[\-\s]Level Spell Slot\.?|At Higher Levels\.?)/i,
    /\s*(Cantrip Upgrade\.?)/i,
  ]
  for (const pattern of patterns) {
    const idx = description.search(pattern)
    if (idx !== -1) {
      const match = description.match(pattern)
      return {
        body: description.slice(0, idx).trim(),
        higherLevels: description.slice(idx).trim(),
        higherLevelsLabel: match[1],
      }
    }
  }
  return { body: description, higherLevels: null, higherLevelsLabel: null }
}

/**
 * School-to-color theme mapping
 */
export const SCHOOL_THEMES = {
  Abjuration:   { accent: '#3b6ea5', badge: '#1e3d5c', glow: 'rgba(59,110,165,0.4)' },
  Conjuration:  { accent: '#b8860b', badge: '#6b4e00', glow: 'rgba(184,134,11,0.4)' },
  Divination:   { accent: '#7b68ee', badge: '#3d2a8c', glow: 'rgba(123,104,238,0.4)' },
  Enchantment:  { accent: '#c2185b', badge: '#7a0033', glow: 'rgba(194,24,91,0.4)' },
  Evocation:    { accent: '#c84b00', badge: '#7a2c00', glow: 'rgba(200,75,0,0.4)' },
  Illusion:     { accent: '#6a0dad', badge: '#3d006e', glow: 'rgba(106,13,173,0.4)' },
  Necromancy:   { accent: '#2e7d32', badge: '#1b4d1e', glow: 'rgba(46,125,50,0.4)' },
  Transmutation:{ accent: '#8b5a00', badge: '#5a3800', glow: 'rgba(139,90,0,0.4)' },
}

export function getSchoolTheme(school) {
  return SCHOOL_THEMES[school] || { accent: '#5a3820', badge: '#3d2411', glow: 'rgba(90,56,32,0.4)' }
}
