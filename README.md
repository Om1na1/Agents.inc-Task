# OKLCH Color Picker

**Live demo:** [agents-inc-task-omina.vercel.app](https://agents-inc-task-omina.vercel.app/#0.7,0.15,240,100)

An interactive React color picker for exploring and selecting colors in the [OKLCH](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch) color space — similar to [oklch.com](https://oklch.com/#0.7,0.15,240,100).

## Features

- **Four sliders** — Lightness (L), Chroma (C), Hue (H), and Alpha (A) with live color preview
- **Bidirectional color I/O** — copy or paste colors as `oklch(...)` or `rgb(...)` strings; sliders sync automatically
- **Out-of-gamut detection** — identifies OKLCH values outside sRGB and shows wide-gamut vs. mapped fallback previews
- **Shareable URL state** — color encoded in the URL hash (`#L,C,H,A`); loading or sharing the URL restores the exact color

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production build

```bash
npm run build
npm run preview
```

## Usage

1. Drag the **L**, **C**, **H**, and **A** sliders to explore the OKLCH color space.
2. Copy the **OKLCH** or **RGB** string using the Copy buttons.
3. Paste a color string (`oklch(70% 0.15 240)`, `rgb(59 130 246)`, `#3b82f6`, etc.) into either input field and press Enter.
4. Share the URL — the hash fragment encodes the current color (e.g. [`#0.7,0.15,240,100`](https://agents-inc-task-omina.vercel.app/#0.7,0.15,240,100)).

### Try these examples

| Link | What it demonstrates |
|------|----------------------|
| [Default blue](https://agents-inc-task-omina.vercel.app/#0.7,0.15,240,100) | In sRGB gamut |
| [Out of gamut](https://agents-inc-task-omina.vercel.app/#0.7,0.35,120,100) | Wide-gamut warning + sRGB fallback swatch |

## Architecture

```
src/
├── types/color.ts          # OklchColor type and channel ranges
├── lib/
│   ├── color.ts            # Parse, format, gamut detection (culori)
│   └── urlHash.ts          # URL hash serialization/parsing
├── hooks/
│   ├── useColorState.ts    # Central color state management
│   └── useUrlHashSync.ts   # Bidirectional URL ↔ state sync
└── components/
    ├── ColorPicker.tsx     # Main layout
    ├── SliderControl.tsx   # Reusable range slider
    ├── ColorPreview.tsx    # Live swatch preview
    ├── ColorInputs.tsx     # OKLCH/RGB copy-paste fields
    └── GamutIndicator.tsx  # sRGB gamut status
```

### Data flow

```
User input (sliders / paste)
        ↓
  useColorState (OklchColor)
        ↓
  lib/color.ts (culori conversions)
        ↓
  Preview + formatted strings
        ↕
  useUrlHashSync ↔ #L,C,H,A
```

## Color Conversion: Why culori?

OKLCH ↔ sRGB conversion involves multiple color-space transforms (OKLab → XYZ → linear sRGB) plus gamut mapping for out-of-gamut colors. Rather than reimplementing this, the project uses **[culori](https://culorijs.org/)**:

| Function | Purpose |
|----------|---------|
| `parse()` | Accept pasted strings in OKLCH, RGB, hex, HSL, etc. |
| `converter('oklch', 'rgb')` | Convert between color spaces |
| `inGamut('rgb')` | Detect whether an OKLCH value fits within sRGB |
| `toGamut('rgb', 'oklch')` | Map out-of-gamut colors using the CSS Color 4 chroma-reduction algorithm |

All culori usage is isolated in `src/lib/color.ts` so components stay free of conversion logic.

## URL Hash Format

Following the [oklch.com convention](https://oklch.com/):

```
#L,C,H,A
```

| Segment | Meaning | Example |
|---------|---------|---------|
| L | Lightness (0–1) | `0.7` |
| C | Chroma | `0.15` |
| H | Hue (0–360) | `240` |
| A | Alpha (0–100, percent) | `100` |

Example: `#0.7,0.15,240,100` → `oklch(70% 0.15 240)`

Legacy compatibility: if L > 1, it is treated as a percentage (e.g. `70` → `0.7`).

## Out-of-Gamut Behavior

Many vivid OKLCH colors (high chroma at certain lightness/hue combinations) cannot be displayed on standard sRGB monitors.

When a color is **in sRGB gamut**:
- Single preview swatch
- Green "In sRGB gamut" indicator

When a color is **outside sRGB gamut**:
- Primary swatch uses wide-gamut CSS (`display-p3`) when the browser supports it
- Secondary swatch shows the sRGB fallback via CSS Color 4 chroma reduction
- Orange "Outside sRGB gamut" warning with explanation
- RGB output reflects the mapped sRGB value; OKLCH output shows the requested (unmapped) color

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** for dev/build tooling
- **culori** for color-space math

## Commit History

| Commit | Description |
|--------|-------------|
| `chore: scaffold Vite React TypeScript project` | Project setup, tooling, dependencies |
| `feat: add OKLCH color utilities with culori` | Color parsing, formatting, gamut helpers |
| `feat: implement color picker UI and URL hash sync` | Sliders, preview, inputs, URL state |
| `docs: add README with setup, architecture, and design decisions` | This documentation |
| `chore: production build verification` | Build fixes and validation |

## License

MIT
