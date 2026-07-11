# NYC Maxxing

A personal map of NYC neighborhoods across the 5 boroughs. Click a neighborhood to mark it
Lived / Visited / Want to go, and see what's notable about it. All data is stored locally
in the browser (`localStorage`) for now — no accounts, no backend.

## Getting started

```bash
npm install
npm run dev
```

This starts the Vite dev server (default: `http://localhost:5173`) with hot reload.

## Scripts

```bash
npm run dev       # start the dev server
npm run build     # type-check and build for production (output in dist/)
npm run preview   # serve the production build locally
npm run lint      # run oxlint
npm run test      # run the test suite
```

## Map data

`src/data/nyc-nta-topo.json` holds the real 2020 NYC Neighborhood Tabulation Area (NTA)
boundaries — 262 geographies across the 5 boroughs — pulled from NYC Open Data
("2020 Neighborhood Tabulation Areas (NTAs)", dataset `9nt8-h7nd` on
`data.cityofnewyork.us`). `src/data/neighborhoods.ts` is generated from it and currently has
empty `recommendations`/`culturalFlag` for every neighborhood; hand-fill content for
individual neighborhoods as needed.

To refresh the boundaries from source:

1. Pull the current GeoJSON from NYC Open Data:
   ```bash
   curl -o nynta2020.geojson \
     "https://data.cityofnewyork.us/resource/9nt8-h7nd.geojson?\$limit=1000"
   ```
2. Convert/reproject/simplify with `mapshaper` (already a dev dependency), renaming the
   Socrata field names to what `scripts/generate-neighborhoods.mjs` expects:
   ```bash
   npx mapshaper nynta2020.geojson \
     -rename-fields NTA2020=nta2020,NTAName=ntaname,BoroName=boroname \
     -filter-fields NTA2020,NTAName,BoroName \
     -proj wgs84 \
     -simplify 10% keep-shapes \
     -o format=topojson quantization=1e5 src/data/nyc-nta-topo.json
   ```
3. Regenerate the static metadata file from the new topology:
   ```bash
   node scripts/generate-neighborhoods.mjs
   ```
   This overwrites `src/data/neighborhoods.ts` with an entry per neighborhood (empty
   `recommendations`/`culturalFlag`), so re-apply any hand-written content afterwards.

## Architecture notes

- **Storage**: all `localStorage` access goes through `src/storage/neighborhoodStorage.ts`. This
  is the only file that touches `localStorage` directly, so swapping in IndexedDB or a backend
  API later only means changing this one module.
- **State**: `src/store/useNeighborhoodStore.ts` (Zustand) is the single write path for status
  changes; components never call the storage module directly.
