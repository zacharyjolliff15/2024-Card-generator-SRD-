import { useState, useEffect, useRef } from 'react'
import SpellCardFront from './components/SpellCardFront'
import SpellCardBack from './components/SpellCardBack'

const STORAGE_KEY = 'spell-card-images'
const PAGE_SIZE = 6

function loadImages() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function PrintIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  )
}

export default function App() {
  const [spells, setSpells] = useState([])
  const [images, setImages] = useState({})
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('both') // 'front' | 'back' | 'both'
  const fileInputRef = useRef(null)
  const uploadTargetRef = useRef(null)

  useEffect(() => {
    fetch('/spells.json')
      .then(r => r.json())
      .then(data => { setSpells(data); setLoading(false) })
      .catch(() => setLoading(false))
    setImages(loadImages())
  }, [])

  const totalPages = Math.ceil(spells.length / PAGE_SIZE)
  const pageSpells = spells.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  function handleImageUpload(spellIndex) {
    uploadTargetRef.current = spellIndex
    fileInputRef.current?.click()
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file || uploadTargetRef.current == null) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target.result
      const updated = { ...images, [uploadTargetRef.current]: dataUrl }
      setImages(updated)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
      uploadTargetRef.current = null
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

  function handlePrint() {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-amber-200 font-cinzel text-xl">Loading spells…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-900">

      {/* ── Hidden file input ── */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* ── Header (screen only) ── */}
      <header className="screen-only sticky top-0 z-10 bg-stone-900 border-b border-amber-900/40 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-cinzel text-2xl font-bold text-amber-200 tracking-wide">
              D&amp;D Spell Cards
            </h1>
            <p className="text-stone-400 text-sm mt-0.5">
              {spells.length} spells · Page {page + 1} of {totalPages} · Showing {pageSpells.length} cards
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* View toggle */}
            <div className="flex rounded-lg overflow-hidden border border-stone-700 text-sm">
              {['front', 'both', 'back'].map(v => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  className={`px-3 py-1.5 capitalize transition-colors ${
                    viewMode === v
                      ? 'bg-amber-700 text-amber-100'
                      : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                  }`}
                >
                  {v === 'both' ? 'Front & Back' : v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>

            {/* Print button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-amber-700 hover:bg-amber-600 text-amber-100 rounded-lg font-semibold text-sm transition-colors shadow-md"
            >
              <PrintIcon />
              Print Cards
            </button>
          </div>
        </div>
      </header>

      {/* ── Pagination (screen only) ── */}
      <div className="screen-only max-w-7xl mx-auto px-6 pt-4 flex items-center gap-2">
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className="px-3 py-1.5 rounded bg-stone-800 text-stone-300 hover:bg-stone-700 disabled:opacity-30 text-sm transition-colors"
        >
          ← Prev
        </button>
        <div className="flex gap-1">
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                page === i
                  ? 'bg-amber-700 text-amber-100'
                  : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
          {totalPages > 10 && <span className="text-stone-500 px-2 self-center">…{totalPages}</span>}
        </div>
        <button
          onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={page === totalPages - 1}
          className="px-3 py-1.5 rounded bg-stone-800 text-stone-300 hover:bg-stone-700 disabled:opacity-30 text-sm transition-colors"
        >
          Next →
        </button>
      </div>

      {/* ── Print instructions banner ── */}
      <div className="screen-only max-w-7xl mx-auto px-6 pt-3">
        <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg px-4 py-2.5 text-sm text-amber-300/80 flex items-start gap-3">
          <span className="text-lg leading-none">💡</span>
          <span>
            <strong>How to print:</strong> Click an image area on any front card to upload custom artwork.
            Hit <strong>Print Cards</strong> to open the print dialog — fronts print on page 1, backs on page 2 (ready for double-sided printing).
          </span>
        </div>
      </div>

      {/* ── Card Grid (screen view) ── */}
      <main className="screen-only max-w-7xl mx-auto px-6 py-6">
        <div className={`grid gap-10 ${
          viewMode === 'both'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
        }`}>
          {pageSpells.map((spell) => {
            const imgUrl = images[spell.index]
            return (
              <div key={spell.index} className="flex flex-col items-center gap-2">
                {/* Card pair */}
                <div className={`flex gap-4 items-start ${viewMode === 'both' ? '' : ''}`}>
                  {viewMode !== 'back' && (
                    <div className="relative group">
                      <SpellCardFront
                        spell={spell}
                        imageUrl={imgUrl}
                        onImageClick={() => handleImageUpload(spell.index)}
                      />
                      {/* Upload button overlay */}
                      <button
                        onClick={() => handleImageUpload(spell.index)}
                        className="absolute bottom-14 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/80 text-amber-300 p-1.5 rounded-md text-xs flex items-center gap-1 shadow"
                      >
                        <UploadIcon /> Art
                      </button>
                      {imgUrl && (
                        <button
                          onClick={() => clearImage(spell.index)}
                          className="absolute top-12 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-900/80 text-red-300 p-1.5 rounded-md shadow"
                          title="Remove image"
                        >
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                  )}
                  {viewMode !== 'front' && (
                    <SpellCardBack spell={spell} />
                  )}
                </div>
                {/* Spell name label */}
                <p className="text-stone-400 text-xs text-center font-cinzel truncate max-w-[300px]">
                  {spell.name}
                </p>
              </div>
            )
          })}
        </div>
      </main>

      {/* ══════════════════════════════════════════════
          PRINT LAYOUT  (only visible when printing)
          Page 1: 6 fronts   Page 2: 6 backs
      ══════════════════════════════════════════════ */}
      <div className="print-only">
        {/* Page 1 — Fronts */}
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

        {/* Page 2 — Backs */}
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
