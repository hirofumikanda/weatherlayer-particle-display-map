# WeatherLayer Particle Display Map - AI Coding Instructions

## Project Overview
Interactive weather visualization app using drag-and-drop PNG data files to display animated particle layers on MapLibre GL maps. Built with React 19, TypeScript, and WeatherLayers GL for specialized weather data visualization.

## Architecture & Data Flow

### Core Components
- **useMap hook** (`src/hooks/useMap.ts`): Central state management for map, DeckGL overlay, and particle parameters
- **MapView** (`src/components/MapView.tsx`): Main container with drag-and-drop file handling and UI state
- **ParticleControls** (`src/components/ParticleControls.tsx`): Real-time parameter adjustment sliders

### Key Data Flow
1. User drops PNG → `fileToTextureData()` converts File to WeatherLayers TextureData format
2. `updateParticleLayer()` stores image in `currentImageRef` and creates initial ParticleLayer
3. Parameter changes trigger `updateParticleParams()` → recreates layer with new settings
4. DeckGL overlay renders particles on MapLibre GL map with Globe projection

## Critical Patterns

### WeatherLayers Integration
- Use `WeatherLayers.ParticleLayer` from `weatherlayers-gl` library (v2025.8.0+)
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
  imageUnscale: [number, number]; // min, max data value scaling
  bounds: [number, number, number, number]; // [west, south, east, north]
}
```

### Ref-based Architecture Pattern
- `currentImageRef`: Stores processed image data for parameter updates without re-processing
- `currentParamsRef`: Maintains parameter state for layer recreation
- `deckOverlayRef`: Direct access to DeckGL overlay for layer updates
- **Critical**: All refs must be checked for null before use in callbacks

## Development Commands

```bash
npm run dev          # Vite dev server with HMR
npm run build        # TypeScript compilation + Vite build  
npm run deploy       # Build + deploy to GitHub Pages
npm run preview      # Preview production build locally
npm run lint         # ESLint with TypeScript rules
```

## Naming Conventions & Consistency
- **Function naming**: Use `updateParticleLayer` not `updateDataLayer` or `updateWindLayer`
- **State naming**: Use `hasParticleLayer` to control UI visibility
- **Error messages**: Use "Particle layer update failed" for consistency
- **UI text**: Use "ParticleLayer" (not "Particleレイヤー") in instruction text

## File Conventions

### Import Patterns
- Use `type` imports for interfaces: `import type { ParticleParams } from "./ParticleControls"`
- WeatherLayers as namespace: `import * as WeatherLayers from "weatherlayers-gl"`
- DeckGL MapboxOverlay: `import { MapboxOverlay } from "@deck.gl/mapbox"`

### Styling Architecture  
- Component-specific CSS files in `src/styles/`
- Inline styles for dynamic/conditional styling (loading, errors, drag states)
- Dark mode support via `@media (prefers-color-scheme: dark)` in CSS files
- Japanese UI text with consistent error messaging

## Integration Points

### MapLibre + DeckGL Initialization Sequence
1. Create MapLibre map with globe projection capability
2. Wait for `map.on('load')` event
3. Set globe projection: `map.setProjection({ type: 'globe' })`
4. Initialize DeckGL overlay with `interleaved: true`
5. Cast overlay as `any` when adding: `map.addControl(deckOverlay as any)`

### File Processing Pipeline
- Accept only PNG files: `file.type === 'image/png'`
- Convert to ImageBitmap using `createImageBitmap(file)`
- Extract RGBA data via Canvas 2D context
- Clean up blob URLs with `URL.revokeObjectURL()`
- Format as WeatherLayers TextureData with 4 bands (RGBA)

## Error Handling Patterns
- Async operations wrapped in try-catch with Japanese user-friendly error messages
- File validation before processing (type, count limitations)
- Canvas context creation validation with descriptive errors
- Layer update failures logged but don't crash app
- Error states cleared on successful operations

## UI State Management
- `hasParticleLayer`: Controls visibility of parameter controls and instruction text
- `isDragOver`: Visual feedback during drag operations with blue overlay
- `isLoading`: Progress indication during file processing
- `errorMessage`: User-facing error display with click-to-dismiss
- Conditional rendering based on particle layer existence

## GitHub Pages Deployment
- Base path configured in `vite.config.ts`: `/weatherlayer-particle-display-map/`
- Automated deployment via GitHub Actions on main branch push
- Uses `gh-pages` package for dist folder deployment
- Homepage URL in package.json must match GitHub Pages URL