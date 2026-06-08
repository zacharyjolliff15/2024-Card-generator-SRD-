import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs/promises'
import path from 'node:path'

const SPELLS_PATH = path.resolve('public/spells.json')

const EDITABLE_SPELL_FIELDS = new Set([
  'description',
  'casting_time',
  'range',
  'duration',
  'components',
  'material',
])

function spellSavePlugin() {
  return {
    name: 'spell-save',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== '/api/spells/save' || req.method !== 'POST') {
          return next()
        }

        let body = ''
        req.on('data', chunk => { body += chunk })
        req.on('end', async () => {
          try {
            const { index, updates } = JSON.parse(body || '{}')
            if (!index || !updates || typeof updates !== 'object') {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Missing index or updates' }))
              return
            }

            const raw = await fs.readFile(SPELLS_PATH, 'utf-8')
            const spells = JSON.parse(raw)
            const spellIdx = spells.findIndex(spell => spell.index === index)
            if (spellIdx === -1) {
              res.statusCode = 404
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Spell not found' }))
              return
            }

            for (const [key, value] of Object.entries(updates)) {
              if (EDITABLE_SPELL_FIELDS.has(key)) {
                spells[spellIdx][key] = value
              }
            }

            await fs.writeFile(SPELLS_PATH, `${JSON.stringify(spells, null, 2)}\n`)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true, spell: spells[spellIdx] }))
          } catch (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err.message || 'Save failed' }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), spellSavePlugin()],
})
