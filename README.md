# D&D Spell Cards

A browser-based tool for browsing, customizing, and printing tabletop-sized spell cards for Dungeons & Dragons. Each card has a front (artwork + quick stats) and a back (full description, materials, and class list), laid out for letter-size paper at **70 mm × 120 mm** per card.

The app ships with **392 SRD spells** in `public/spells.json`. Add your own artwork per spell and print fronts and backs on separate pages for double-sided cards.

## Features

- **Full SRD spell library** — casting time, range, duration, components, school, ritual flag, description, higher-level scaling, material components, and class lists
- **Print-ready layout** — choose **4 cards per page** (2×2) or **6 cards per page** (3×2); prints two pages per batch (fronts, then backs)
- **Custom artwork** — drop JPG files into `public/art/` or preview a temporary image in the browser for the current session
- **Paginated browsing** — navigate spell sets page by page with your preferred cards-per-page setting (saved in local storage)
- **Card design**
  - **Front:** spell name banner, artwork area, level/school label, and a compact info bar (casting time, range, duration, components)
  - **Back:** full description with higher-level text split out, material line, ritual badge, and class list
- **Print-optimized CSS** — screen UI is hidden when printing; cards scale to exact physical dimensions with color preservation

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later (20+ recommended)
- npm (included with Node.js)

## Local setup

```bash
# Clone the repository
git clone <your-repo-url>
cd "Card App"

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

To use a specific port:

```bash
npm run dev -- --port 5173
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |

After building:

```bash
npm run build
npm run preview
```

## Using the app

### Browse spells

Use **Prev page** / **Next page** or the numbered page buttons in the header. Toggle **Cards per page** between 4 and 6; your choice is remembered between visits.

Each screen page shows two preview sections:

1. **Fronts** — artwork and quick-reference stats  
2. **Backs** — full spell text for the same spells on that page

### Add artwork

Permanent artwork lives on disk. Name each file after the spell's `index` field from `spells.json`:

```
public/art/{spell-index}.jpg
```

Examples:

```
public/art/acid-splash.jpg
public/art/fireball.jpg
public/art/alter-self.jpg
```

The app loads `/art/{spell-index}.jpg` automatically. If a file is missing, the card shows a placeholder.

**Session preview (optional):** hover a card front and click **Preview image**, or click the artwork area directly. This loads an image for the current browser session only — it is not saved to disk. Use **Clear preview** to remove it. For permanent artwork, copy the file into `public/art/` with the correct name.

### Print cards

1. Navigate to the spell page you want.
2. Choose 4 or 6 cards per page.
3. Click **Print Cards** (or use the browser print dialog).
4. Print **page 1 (fronts)**, then reload/print **page 2 (backs)** on the reverse side of the same sheet, or print fronts and backs separately and glue/laminate.

**Print tips:**

- Use **Letter (8.5×11 in)** portrait orientation.
- Enable **Background graphics** so card colors and gradients print correctly.
- Margins are handled by the layout; browser default margins are fine.
- Each print job outputs two physical pages: one sheet of fronts, one sheet of backs for the current spell batch.

## Project structure

```
├── public/
│   ├── spells.json       # Spell data (392 SRD spells)
│   └── art/              # Spell artwork ({index}.jpg)
├── src/
│   ├── App.jsx           # Main app: pagination, print layout, image upload
│   ├── components/
│   │   ├── SpellCardFront.jsx
│   │   └── SpellCardBack.jsx
│   ├── utils/
│   │   └── spellUtils.js # Formatting helpers (duration, level, description)
│   ├── index.css         # Tailwind + print styles
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Spell data format

Each entry in `public/spells.json` is an object with fields such as:

| Field | Description |
|-------|-------------|
| `index` | URL-safe slug used for artwork filenames (e.g. `"acid-splash"`) |
| `name` | Display name |
| `level` | Spell level (`0` = cantrip) |
| `school` | Magic school (Evocation, Abjuration, etc.) |
| `casting_time` | e.g. `"Action"`, `"Bonus Action"` |
| `range` | e.g. `"60 ft"`, `"Self"` |
| `duration` | e.g. `"Instantaneous"`, `"Concentration, up to 1 hour"` |
| `concentration` | Boolean |
| `components` | Array of `"V"`, `"S"`, `"M"` |
| `material` | Material component text, or `null` |
| `ritual` | Boolean |
| `description` | Array of description strings |
| `classes` | Array of class names |

To add or edit spells, update `public/spells.json` and restart the dev server if needed.

## Card dimensions

| Context | Size |
|---------|------|
| Screen preview | 280 × 480 px |
| Printed card | 70 mm × 120 mm (2.756 × 4.724 in) |
| 4 per page | 2 columns × 2 rows on letter paper |
| 6 per page | 3 columns × 2 rows on letter paper |

## Tech stack

- [React 18](https://react.dev/)
- [Vite 6](https://vite.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- Google Fonts: [Cinzel](https://fonts.google.com/specimen/Cinzel) (headings), [EB Garamond](https://fonts.google.com/specimen/EB+Garamond) (body text)

## License & attribution

Spell content is based on the D&D System Reference Document (SRD). Artwork is your own — add images to `public/art/` under whatever license applies to your assets.

This project is for personal and tabletop use. Wizards of the Coast owns the D&D trademarks and SRD content; consult the [SRD](https://dnd.wizards.com/resources/systems-reference-document) for usage terms.

Image prompts to gemini pro with spell desc: 

A high-quality digital fantasy illustration portrait not landscape with no words or text  of [SPELL], [DESC]. The art style is cinematic, painterly, and highly detailed, consistent with professional Dungeons & Dragons card art. The composition features a strong, dramatic focal point with intense, glowing magical energy casting vibrant light onto the surroundings. Rich, saturated colors, deep shadows, atmospheric, high-contrast, epic fantasy aesthetic, intricate textures, masterpiece, no boarders. Keep the width and height 864 × 1216

