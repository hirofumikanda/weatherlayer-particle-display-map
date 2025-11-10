# WeatherLayer Particle Display Map - AI Coding Instructions

## Project Overview
Interactive weather visualization app using drag-and-drop PNG wind data files to display animated particle layers on MapLibre GL maps. Built with React, TypeScript, and specialized weather visualization libraries.

## Architecture & Data Flow

### Core Components
- **useMap hook** (`src/hooks/useMap.ts`): Central state management for map, DeckGL overlay, and particle parameters
- **MapView** (`src/components/MapView.tsx`): Main container with drag-and-drop file handling and UI state
- **ParticleControls** (`src/components/ParticleControls.tsx`): Real-time parameter adjustment sliders

### Key Data Flow
1. User drops PNG → `fileToTextureData()` converts File to WeatherLayers TextureData format
2. `updateWindLayer()` stores image in `currentImageRef` and creates initial ParticleLayer
3. Parameter changes trigger `updateParticleParams()` → recreates layer with new settings
4. DeckGL overlay renders particles on MapLibre GL map

## Critical Patterns

### WeatherLayers Integration
- Use `WeatherLayers.ParticleLayer` from `weatherlayers-gl` library
- Custom `fileToTextureData()` function: File → ImageBitmap → Canvas → RGBA pixel data → TextureData format
- TextureData structure: `{ data: Uint8ClampedArray, width: number, height: number, bandsCount: 4 }`

### Parameter State Management
```typescript
// ParticleParams interface defines all adjustable properties
interface ParticleParams {
  numParticles: number;
  maxAge: number; 
  speedFactor: number;
  width: number;
  imageUnscale: [number, number]; // min, max wind speed scaling
  bounds: [number, number, number, number]; // [west, south, east, north]
}
```

### Ref-based Architecture
- `currentImageRef`: Stores processed image data for parameter updates without re-processing
- `currentParamsRef`: Maintains parameter state for layer recreation
- `deckOverlayRef`: Direct access to DeckGL overlay for layer updates

## Development Commands

```bash
npm run dev          # Vite dev server with HMR
npm run build        # TypeScript compilation + Vite build
npm run deploy       # Build + deploy to GitHub Pages
npm run preview      # Preview production build locally
```

## File Conventions

### Import Patterns
- Use `type` imports for interfaces: `import type { ParticleParams } from "./ParticleControls"`
- WeatherLayers as namespace: `import * as WeatherLayers from "weatherlayers-gl"`
- DeckGL MapboxOverlay: `import { MapboxOverlay } from "@deck.gl/mapbox"`

### Styling
- CSS Modules pattern: component-specific CSS files in `src/styles/`
- Inline styles for dynamic/conditional styling
- Dark mode support via `@media (prefers-color-scheme: dark)`

### Public Assets
- MapLibre style JSON: `public/styles/style.json` (MIERUNE mono tiles)
- Font glyphs: `public/font/` directory structure for multi-language support
- Static images: `public/img/` (currently unused - drag-and-drop replaces static assets)

## Integration Points

### MapLibre + DeckGL
- Initialize MapLibre first, then add DeckGL overlay on `map.on('load')`
- Use `interleaved: true` for proper layer ordering
- Cast overlay as `any` when adding: `map.addControl(deckOverlay as any)`

### File Processing Pipeline
- Accept only PNG files: `file.type === 'image/png'`
- Convert to ImageBitmap for efficient pixel access
- Extract RGBA data via Canvas 2D context
- Format as WeatherLayers TextureData with 4 bands (RGBA)

## Error Handling Patterns
- Async operations wrapped in try-catch with user-friendly error messages
- File validation before processing (type, count)
- Canvas context creation validation
- Layer update failures logged but don't crash app

## UI State Management
- `hasParticleLayer`: Controls visibility of parameter controls and instruction text
- `isDragOver`: Visual feedback during drag operations
- `isLoading`: Progress indication during file processing
- Conditional rendering based on these states

## GitHub Pages Deployment
- Base path configured in `vite.config.ts`: `/weatherlayer-particle-display-map/`
- Automated deployment via GitHub Actions on main branch push
- Uses `gh-pages` package for dist folder deployment