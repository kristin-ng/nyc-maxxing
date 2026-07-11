# NYC Maxxing

A personal map of NYC neighborhoods across the 5 boroughs. Click a neighborhood to mark it
Lived / Visited / Want to go, and see what's notable about it. All data is stored locally
in the browser (`localStorage`) for now — no accounts, no backend.

## Getting started

```bash
npm install
npm run dev
```

## Testing

```bash
npm run test
```

## Map data

`src/data/nyc-nta-topo.json` is currently a small **hand-built placeholder** (5 neighborhoods,
one per borough, drawn as simple rectangles) so the app is fully functional end-to-end without
depending on external data access. It is not real geography.

To replace it with the real NYC Neighborhood Tabulation Area (NTA) boundaries:

1. Download the 2020 NTA boundaries from NYC Open Data ("Neighborhood Tabulation Areas (NTA)")
   or DCP's "Bytes of the Big Apple" GIS page, as GeoJSON or Shapefile.
2. Convert/reproject/simplify with `mapshaper` (already a dev dependency):
   ```bash
   npx mapshaper nynta2020.geojson \
     -proj wgs84 \
     -simplify 10% keep-shapes \
     -o format=topojson quantization=1e5 src/data/nyc-nta-topo.json
   ```
3. Regenerate the static metadata file from the new topology:
   ```bash
   node scripts/generate-neighborhoods.mjs
   ```
   This overwrites `src/data/neighborhoods.ts` with an entry per real neighborhood (empty
   `recommendations`/`culturalFlag`). Hand-fill content for individual neighborhoods afterwards
   — see the existing entries for Williamsburg/Upper East Side as examples.

## Architecture notes

- **Storage**: all `localStorage` access goes through `src/storage/neighborhoodStorage.ts`. This
  is the only file that touches `localStorage` directly, so swapping in IndexedDB or a backend
  API later only means changing this one module.
- **State**: `src/store/useNeighborhoodStore.ts` (Zustand) is the single write path for status
  changes; components never call the storage module directly.
