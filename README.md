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

`src/data/nyc-neighborhoods-topo.json` holds 268 real-named NYC neighborhoods — granular areas
like Carroll Gardens, Cobble Hill, and Red Hook as distinct shapes, rather than merged into one
official administrative zone — derived from
[`custom-nyc-neighborhoods`](https://github.com/HodgesWardElliott/custom-nyc-neighborhoods) by
HodgesWardElliott (itself Zillow/PediaCities-derived; no explicit license, but widely reused by
hobby NYC projects). `src/data/neighborhoods.ts` is generated from it and currently has empty
`recommendations`/`culturalFlag` for every neighborhood; hand-fill content for individual
neighborhoods as needed.

Each neighborhood's `id` is derived from the last path segment of its source `X.id` PediaCities
resource URL (e.g. `Carroll_Gardens`), falling back to a slugified name for the handful of
entries with no `X.id`. A few dataset entries are themselves parks/cemeteries/airports/islands
rather than residential neighborhoods (e.g. `Central_Park`, `Green_Wood_Cemetery`,
`LaGuardia_Airport`) — these are shaded gray on the map and excluded from tracking/stats via
the hand-curated list in `src/utils/nonResidentialAreas.ts` (the dataset has no id convention
to compute this from, unlike NTAs).

To refresh the boundaries from source:

1. Pull the source GeoJSON:
   ```bash
   curl -L -o custom-pedia-cities-nyc-Mar2018.geojson \
     "https://raw.githubusercontent.com/HodgesWardElliott/custom-nyc-neighborhoods/master/custom-pedia-cities-nyc-Mar2018.geojson"
   ```
2. Convert/reproject/simplify with `mapshaper` (already a dev dependency). This derives a
   stable `id` per neighborhood from the `X.id` resource URL (falling back to the neighborhood
   name when `X.id` is null) and dissolves multi-fragment neighborhoods (bay islands etc. that
   appear as several disjoint polygons in the source) into single features:
   ```bash
   npx mapshaper custom-pedia-cities-nyc-Mar2018.geojson \
     -rename-fields name=neighborhood,sourceId="X.id" \
     -each 'id=(sourceId||name).split("/").pop().replace(/\s+/g,"_")' \
     -filter-fields id,name,borough \
     -dissolve id multipart copy-fields=name,borough \
     -proj wgs84 \
     -simplify 10% keep-shapes \
     -o format=topojson quantization=1e5 src/data/nyc-neighborhoods-topo.json
   ```
   312 raw source features dissolve to 268 final neighborhoods.
3. Regenerate the static metadata file from the new topology:
   ```bash
   node scripts/generate-neighborhoods.mjs
   ```
   This overwrites `src/data/neighborhoods.ts` with an entry per neighborhood (empty
   `recommendations`/`culturalFlag`), so re-apply any hand-written content afterwards. The
   script throws if it finds a duplicate id — if the source dataset changes and introduces a
   real collision, adjust the mapshaper `-each`/`-dissolve` step above and regenerate. If new
   parks/cemeteries/airports appear, also update `src/utils/nonResidentialAreas.ts`.

## Architecture notes

- **Storage**: all `localStorage` access goes through `src/storage/neighborhoodStorage.ts`. This
  is the only file that touches `localStorage` directly, so swapping in IndexedDB or a backend
  API later only means changing this one module.
- **State**: `src/store/useNeighborhoodStore.ts` (Zustand) is the single write path for status
  changes; components never call the storage module directly.
