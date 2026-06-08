import { useState, useEffect, useRef, useMemo } from 'react'
import SpellCardFront from './components/SpellCardFront'
import SpellCardBack from './components/SpellCardBack'
import { getClassTheme } from './utils/spellUtils'

const STORAGE_PER_PAGE_KEY = 'spell-card-per-page'

function getImageSrc(spellIndex, tempOverrides) {
  if (tempOverrides[spellIndex]) return tempOverrides[spellIndex]
  return `/art/${spellIndex}.jpg`
}

/* ── Icon helpers ──────────────────────────────────── */
const PrintIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
)
const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4h6v2" />
  </svg>
)
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

/* ── Page section label ─────────────────────────────── */
function PageLabel({ number, label, count }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex items-center gap-2">
        <span className="w-7 h-7 rounded-full bg-amber-800 text-white text-sm font-bold flex items-center justify-center font-cinzel">
          {number}
        </span>
        <h2 className="text-lg font-bold text-stone-800 font-cinzel tracking-wide">{label}</h2>
      </div>
      <div className="h-px flex-1 bg-stone-300" />
      <span className="text-stone-500 text-sm">{count} cards</span>
    </div>
  )
}

/* ── Card wrapper with upload controls ─────────────── */
function FrontCardWrapper({ spell, imageUrl, hasTempOverride, onUpload, onClearTemp, classTheme }) {
  return (
    <div className="relative group">
      <SpellCardFront
        spell={spell}
        imageUrl={imageUrl}
        onImageClick={onUpload}
        classTheme={classTheme}
      />
      <div className="absolute bottom-16 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onUpload}
          className="flex items-center gap-1.5 px-2 py-1 bg-amber-800/90 text-amber-100 text-xs rounded shadow-md whitespace-nowrap"
          title={`Place file at: public/art/${spell.index}.jpg`}
        >
          <UploadIcon /> Preview image
        </button>
        {hasTempOverride && (
          <button
            onClick={onClearTemp}
            className="flex items-center gap-1.5 px-2 py-1 bg-red-800/90 text-red-100 text-xs rounded shadow-md whitespace-nowrap"
            title="Remove session preview"
          >
            <TrashIcon /> Clear preview
          </button>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [spells, setSpells]         = useState([])
  const [tempImages, setTempImages] = useState({})
  const [page, setPage]             = useState(0)
  const [loading, setLoading]       = useState(true)
  const [perPage, setPerPage]       = useState(() => {
    const saved = parseInt(localStorage.getItem(STORAGE_PER_PAGE_KEY))
    return [4, 6].includes(saved) ? saved : 4
  })

  // Sort + filter state
  const [searchQuery, setSearchQuery]   = useState('')
  const [sortBy, setSortBy]             = useState('az')       // 'az' | 'level' | 'class'
  const [selectedClass, setSelectedClass] = useState(null)     // null = all classes

  const fileInputRef  = useRef(null)
  const uploadTarget  = useRef(null)

  useEffect(() => {
    fetch('/spells.json')
      .then(r => r.json())
      .then(data => { setSpells(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Collect all unique class names from the full dataset
  const allClasses = useMemo(() => {
    const set = new Set()
    spells.forEach(s => s.classes?.forEach(c => set.add(c)))
    return [...set].sort()
  }, [spells])

  // Filter + sort the full spell list
  const filteredSpells = useMemo(() => {
    let result = [...spells]

    // Text search on name
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(s => s.name.toLowerCase().includes(q))
    }

    // Class filter (only when in class sort mode)
    if (sortBy === 'class' && selectedClass) {
      result = result.filter(s => s.classes?.includes(selectedClass))
    }

    // Sort
    if (sortBy === 'az') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'level') {
      result.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
    } else if (sortBy === 'class') {
      result.sort((a, b) => {
        const ca = a.classes?.[0] || 'zzz'
        const cb = b.classes?.[0] || 'zzz'
        return ca.localeCompare(cb) || a.name.localeCompare(b.name)
      })
    }

    return result
  }, [spells, searchQuery, sortBy, selectedClass])

  // Reset to page 0 whenever the filter/sort changes
  useEffect(() => { setPage(0) }, [searchQuery, sortBy, selectedClass])

  const totalPages = Math.ceil(filteredSpells.length / perPage)
  const pageSpells = filteredSpells.slice(page * perPage, page * perPage + perPage)
  const cols       = perPage === 4 ? 2 : 3

  useEffect(() => {
    function handleKeyDown(e) {
      const el = e.target
      if (
        el instanceof HTMLElement &&
        (['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName) || el.isContentEditable)
      ) return

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setPage(p => Math.max(0, p - 1))
      } else if (e.key === 'ArrowRight' && totalPages > 0) {
        e.preventDefault()
        setPage(p => Math.min(totalPages - 1, p + 1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [totalPages])

  // Determine classTheme for a spell
  function getSpellClassTheme(spell) {
    if (sortBy !== 'class') return null
    const cls = selectedClass || spell.classes?.[0]
    return cls ? getClassTheme(cls) : null
  }

  function handlePerPageChange(n) {
    setPerPage(n)
    setPage(0)
    try { localStorage.setItem(STORAGE_PER_PAGE_KEY, String(n)) } catch {}
  }

  function handleSortChange(val) {
    setSortBy(val)
    if (val !== 'class') setSelectedClass(null)
    setPage(0)
  }

  function handleUpload(spellIndex) {
    uploadTarget.current = spellIndex
    fileInputRef.current?.click()
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file || uploadTarget.current == null) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setTempImages(prev => ({ ...prev, [uploadTarget.current]: ev.target.result }))
      uploadTarget.current = null
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function clearTempImage(spellIndex) {
    setTempImages(prev => { const n = { ...prev }; delete n[spellIndex]; return n })
  }

  async function handleSpellSave(spellIndex, updates) {
    const res = await fetch('/api/spells/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index: spellIndex, updates }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(data.error || 'Failed to save spell')
    }

    setSpells(prev => prev.map(spell => (
      spell.index === spellIndex ? data.spell : spell
    )))
  }

  const canEditSpells = import.meta.env.DEV

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-amber-800 font-cinzel text-xl">Loading spells…</div>
      </div>
    )
  }

  const gridClass = cols === 2 ? 'card-grid-2' : 'card-grid-3'
  const isFiltered = searchQuery.trim() || (sortBy === 'class' && selectedClass)

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {/* ══ SCREEN HEADER ══════════════════════════════ */}
      <header className="screen-only bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">

        {/* Row 1: Title + Controls */}
        <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-cinzel text-2xl font-bold text-amber-900 tracking-wide">
              D&amp;D Spell Cards
            </h1>
            <p className="text-gray-500 text-sm">
              {isFiltered
                ? `${filteredSpells.length} of ${spells.length} spells · Page ${page + 1} of ${totalPages || 1}`
                : `${spells.length} spells · Page ${page + 1} of ${totalPages}`
              }
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">

            {/* Sort mode */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Sort:</span>
              <div className="flex rounded-lg overflow-hidden border border-gray-300">
                {[['az', 'A–Z'], ['level', 'Level'], ['class', 'Class']].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => handleSortChange(val)}
                    className={`px-3 py-1.5 text-sm font-semibold transition-colors ${
                      sortBy === val
                        ? 'bg-amber-800 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Per-page toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Per page:</span>
              <div className="flex rounded-lg overflow-hidden border border-gray-300">
                {[4, 6].map(n => (
                  <button
                    key={n}
                    onClick={() => handlePerPageChange(n)}
                    className={`px-4 py-1.5 text-sm font-semibold transition-colors ${
                      perPage === n
                        ? 'bg-amber-800 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Print */}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-amber-800 hover:bg-amber-700 text-white rounded-lg font-semibold text-sm transition-colors shadow"
            >
              <PrintIcon />
              Print Cards
            </button>
          </div>
        </div>

        {/* Row 2: Search */}
        <div className="max-w-screen-xl mx-auto px-6 pb-3">
          <div className="relative max-w-md">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search spells by name…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XIcon />
              </button>
            )}
          </div>
        </div>

        {/* Row 3: Class filter chips (only when sort=class) */}
        {sortBy === 'class' && (
          <div className="border-t border-gray-100 bg-gray-50">
            <div className="max-w-screen-xl mx-auto px-6 py-2 flex gap-2 flex-wrap items-center">
              <span className="text-xs text-gray-500 font-medium mr-1">Filter:</span>
              <button
                onClick={() => { setSelectedClass(null); setPage(0) }}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                  !selectedClass
                    ? 'bg-amber-800 text-white border-amber-800'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              {allClasses.map(cls => {
                const theme = getClassTheme(cls)
                const isActive = selectedClass === cls
                return (
                  <button
                    key={cls}
                    onClick={() => { setSelectedClass(isActive ? null : cls); setPage(0) }}
                    className="px-3 py-1 rounded-full text-xs font-semibold border transition-colors"
                    style={
                      isActive && theme
                        ? { background: theme.accent, color: '#fff', borderColor: theme.accent }
                        : theme
                          ? { background: theme.light, color: theme.accent, borderColor: theme.bg }
                          : { background: '#fff', color: '#444', borderColor: '#d1d5db' }
                    }
                  >
                    {cls}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </header>

      {/* ══ SCREEN PAGINATION ══════════════════════════ */}
      <div className="screen-only max-w-screen-xl mx-auto px-6 pt-4 flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-30 text-sm transition-colors shadow-sm"
        >
          ← Prev
        </button>

        <div className="flex gap-1">
          {Array.from({ length: Math.min(totalPages, 15) }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors shadow-sm ${
                page === i
                  ? 'bg-amber-800 text-white'
                  : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
          {totalPages > 15 && (
            <span className="text-gray-400 px-2 self-center text-sm">…{totalPages} total</span>
          )}
        </div>

        <button
          onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-30 text-sm transition-colors shadow-sm"
        >
          Next →
        </button>

        {/* No-results state */}
        {filteredSpells.length === 0 && (
          <span className="text-gray-500 text-sm ml-2">No spells match your search.</span>
        )}

        <div className="ml-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-800 flex items-center gap-2">
            <span>💡</span>
            <span>
              <strong>Images:</strong> Place files as{' '}
              <code className="bg-amber-100 px-1 rounded">public/art/&#123;spell-index&#125;.jpg</code>.
              Hover a card to preview.
            </span>
          </div>
        </div>
      </div>

      {/* ══ SCREEN CARD LAYOUT ═════════════════════════ */}
      <main className="screen-only max-w-screen-xl mx-auto px-6 py-6 space-y-8">

        {/* Page 1 – Fronts */}
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <PageLabel number="1" label="Fronts — click any card to upload artwork" count={pageSpells.length} />
          <div className={`grid ${cols === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-6 justify-items-center`}>
            {pageSpells.map(spell => (
              <FrontCardWrapper
                key={spell.index}
                spell={spell}
                imageUrl={getImageSrc(spell.index, tempImages)}
                hasTempOverride={Boolean(tempImages[spell.index])}
                onUpload={() => handleUpload(spell.index)}
                onClearTemp={() => clearTempImage(spell.index)}
                classTheme={getSpellClassTheme(spell)}
              />
            ))}
          </div>
        </div>

        {/* Page 2 – Backs */}
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <PageLabel number="2" label={canEditSpells ? 'Backs — click Edit to update spell text' : 'Backs'} count={pageSpells.length} />
          <div className={`grid ${cols === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-6 justify-items-center`}>
            {pageSpells.map(spell => (
              <SpellCardBack
                key={spell.index}
                spell={spell}
                classTheme={getSpellClassTheme(spell)}
                editable={canEditSpells}
                onSave={handleSpellSave}
              />
            ))}
          </div>
        </div>

      </main>

      {/* ══ PRINT LAYOUT ═══════════════════════════════
          Page 1: fronts  |  Page 2: backs
      ═══════════════════════════════════════════════ */}
      <div className={`print-only print-layout-${perPage}`}>

        {/* Print Page 1 — Fronts */}
        <div className="print-page">
          {pageSpells.map(spell => (
            <div key={spell.index} className="print-card">
              <SpellCardFront
                spell={spell}
                imageUrl={getImageSrc(spell.index, tempImages)}
                onImageClick={() => {}}
                classTheme={getSpellClassTheme(spell)}
              />
            </div>
          ))}
        </div>

        {/* Print Page 2 — Backs */}
        <div className="print-page">
          {pageSpells.map(spell => (
            <div key={spell.index} className="print-card">
              <SpellCardBack spell={spell} classTheme={getSpellClassTheme(spell)} />
            </div>
          ))}
        </div>

      </div>

    </div>
  )
}
