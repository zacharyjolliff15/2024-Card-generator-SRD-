import { useState, useEffect, useRef } from 'react'
import SpellCardFront from './components/SpellCardFront'
import SpellCardBack from './components/SpellCardBack'

const STORAGE_KEY = 'spell-card-images'
const STORAGE_PER_PAGE_KEY = 'spell-card-per-page'

function loadImages() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
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

/* ── Spell count badge ─────────────────────────────── */
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
function FrontCardWrapper({ spell, imageUrl, onUpload, onClear }) {
  return (
    <div className="relative group">
      <SpellCardFront
        spell={spell}
        imageUrl={imageUrl}
        onImageClick={onUpload}
      />
      {/* Hover controls */}
      <div className="absolute bottom-20 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onUpload}
          className="flex items-center gap-1.5 px-2 py-1 bg-amber-800/90 text-amber-100 text-xs rounded shadow-md whitespace-nowrap"
          title="Upload artwork"
        >
          <UploadIcon /> Upload art
        </button>
        {imageUrl && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-2 py-1 bg-red-800/90 text-red-100 text-xs rounded shadow-md"
            title="Remove image"
          >
            <TrashIcon /> Remove
          </button>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [spells, setSpells] = useState([])
  const [images, setImages] = useState({})
  const [page, setPage]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [perPage, setPerPage] = useState(() => {
    const saved = parseInt(localStorage.getItem(STORAGE_PER_PAGE_KEY))
    return [4, 6].includes(saved) ? saved : 4
  })
  const fileInputRef   = useRef(null)
  const uploadTarget   = useRef(null)

  useEffect(() => {
    fetch('/spells.json')
      .then(r => r.json())
      .then(data => { setSpells(data); setLoading(false) })
      .catch(() => setLoading(false))
    setImages(loadImages())
  }, [])

  const totalPages  = Math.ceil(spells.length / perPage)
  const pageSpells  = spells.slice(page * perPage, page * perPage + perPage)
  const cols        = perPage === 4 ? 2 : 3

  function handlePerPageChange(n) {
    setPerPage(n)
    setPage(0)
    try { localStorage.setItem(STORAGE_PER_PAGE_KEY, String(n)) } catch {}
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
      const updated = { ...images, [uploadTarget.current]: ev.target.result }
      setImages(updated)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
      uploadTarget.current = null
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function clearImage(spellIndex) {
    const updated = { ...images }
    delete updated[spellIndex]
    setImages(updated)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-amber-800 font-cinzel text-xl">Loading spells…</div>
      </div>
    )
  }

  const gridClass = cols === 2 ? 'card-grid-2' : 'card-grid-3'

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {/* ══ SCREEN HEADER ══════════════════════════════ */}
      <header className="screen-only bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-cinzel text-2xl font-bold text-amber-900 tracking-wide">
              D&amp;D Spell Cards
            </h1>
            <p className="text-gray-500 text-sm">
              {spells.length} spells · Showing page {page + 1} of {totalPages}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Per-page toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Cards per page:</span>
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
      </header>

      {/* ══ SCREEN PAGINATION ══════════════════════════ */}
      <div className="screen-only max-w-screen-xl mx-auto px-6 pt-4 flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-30 text-sm transition-colors shadow-sm"
        >
          ← Prev page
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
          disabled={page === totalPages - 1}
          className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-30 text-sm transition-colors shadow-sm"
        >
          Next page →
        </button>

        <div className="ml-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-800 flex items-center gap-2">
            <span>💡</span>
            <span><strong>Tip:</strong> Click (or hover) a front card to upload custom artwork. It saves automatically.</span>
          </div>
        </div>
      </div>

      {/* ══ SCREEN CARD LAYOUT ═════════════════════════
          Two sheet previews: Fronts then Backs
          Matching the exact print grid layout
      ═══════════════════════════════════════════════ */}
      <main className="screen-only max-w-screen-xl mx-auto px-6 py-6 space-y-8">

        {/* Page 1 – Fronts */}
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <PageLabel number="1" label="Fronts — click any card to upload artwork" count={pageSpells.length} />
          <div className={`grid ${cols === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-6 justify-items-center`}>
            {pageSpells.map(spell => (
              <FrontCardWrapper
                key={spell.index}
                spell={spell}
                imageUrl={images[spell.index]}
                onUpload={() => handleUpload(spell.index)}
                onClear={() => clearImage(spell.index)}
              />
            ))}
          </div>
        </div>

        {/* Page 2 – Backs */}
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <PageLabel number="2" label="Backs" count={pageSpells.length} />
          <div className={`grid ${cols === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-6 justify-items-center`}>
            {pageSpells.map(spell => (
              <SpellCardBack key={spell.index} spell={spell} />
            ))}
          </div>
        </div>

      </main>

      {/* ══════════════════════════════════════════════
          PRINT LAYOUT
          Uses .print-layout-4 or .print-layout-6 class
          Page 1: fronts  |  Page 2: backs
      ═══════════════════════════════════════════════ */}
      <div className={`print-only print-layout-${perPage}`}>

        {/* Print Page 1 — Fronts */}
        <div className="print-page">
          {pageSpells.map(spell => (
            <div key={spell.index} className="print-card">
              <SpellCardFront
                spell={spell}
                imageUrl={images[spell.index]}
                onImageClick={() => {}}
              />
            </div>
          ))}
        </div>

        {/* Print Page 2 — Backs */}
        <div className="print-page">
          {pageSpells.map(spell => (
            <div key={spell.index} className="print-card">
              <SpellCardBack spell={spell} />
            </div>
          ))}
        </div>

      </div>

    </div>
  )
}
