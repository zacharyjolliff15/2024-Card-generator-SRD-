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

/**
 * Class-to-color theme mapping.
 * Each theme has:
 *   accent — strong color for text/icons/borders
 *   bg     — medium tint for info bars and row backgrounds
 *   light  — very light tint for card/banner backgrounds
 */
export const CLASS_THEMES = {
  Artificer: { accent: '#1a4f8c', bg: '#cfe0f4', light: '#eef4fb' },
  Bard:      { accent: '#7a4a10', bg: '#f5ddb0', light: '#fdf6e8' },
  Cleric:    { accent: '#5a2a7a', bg: '#e0d4f0', light: '#f5f0fb' },
  Druid:     { accent: '#1a5a1a', bg: '#c6e3c6', light: '#edf8ed' },
  Fighter:   { accent: '#5c3a18', bg: '#ddd0c0', light: '#f5f0e8' },
  Monk:      { accent: '#6e4e28', bg: '#e8d8c0', light: '#faf4ec' },
  Paladin:   { accent: '#7a6000', bg: '#efe89e', light: '#fdfae8' },
  Ranger:    { accent: '#1a5c2e', bg: '#beddbe', light: '#e8f5e8' },
  Rogue:     { accent: '#28285a', bg: '#c8c8d8', light: '#eeeef8' },
  Sorcerer:  { accent: '#8b0000', bg: '#f0c8c8', light: '#fce8e8' },
  Warlock:   { accent: '#4a006e', bg: '#d0b8e8', light: '#f0e8fc' },
  Wizard:    { accent: '#002288', bg: '#b8cce8', light: '#e8f0fc' },
}

export function getClassTheme(className) {
  return CLASS_THEMES[className] || null
}
