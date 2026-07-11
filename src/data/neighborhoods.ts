import type { NeighborhoodStaticData } from '../types/neighborhood';

// Property key on each TopoJSON geography that holds the neighborhood id (NTA2020 code).
export const NTA_ID_PROPERTY = 'NTA2020';

// PLACEHOLDER: only the 5 neighborhoods in the placeholder topology are listed here.
// Once the real NTA topology is generated (scripts/generate-neighborhoods.mjs), this
// file is regenerated to cover all ~195 neighborhoods.
export const neighborhoods: Record<string, NeighborhoodStaticData> = {
  MN40: {
    id: 'MN40',
    name: 'Upper East Side',
    borough: 'Manhattan',
    culturalFlag: {
      hasNotableCulturalOrHistoricalSignificance: true,
      note: 'Home to Museum Mile — the Met, the Guggenheim, and the Frick sit along Fifth Avenue here.',
    },
    recommendations: [
      { id: 'ues-met', title: 'The Metropolitan Museum of Art', description: 'One of the largest art museums in the world.' },
      { id: 'ues-central-park', title: 'Central Park (east side)', description: 'Bow Bridge and the Conservatory Garden are both nearby.' },
    ],
  },
  BK73: {
    id: 'BK73',
    name: 'Williamsburg',
    borough: 'Brooklyn',
    culturalFlag: {
      hasNotableCulturalOrHistoricalSignificance: true,
      note: 'Historic hub of NYC’s Hasidic Jewish community, alongside a well-known indie/art scene since the 2000s.',
    },
    recommendations: [
      { id: 'wburg-domino', title: 'Domino Park', description: 'Waterfront park built around the old Domino Sugar Refinery.' },
      { id: 'wburg-smorgasburg', title: 'Smorgasburg', description: 'Open-air food market (seasonal, weekends).' },
    ],
  },
  QN70: {
    id: 'QN70',
    name: 'Astoria',
    borough: 'Queens',
    culturalFlag: {
      hasNotableCulturalOrHistoricalSignificance: true,
      note: 'Historically one of the largest Greek communities outside Greece.',
    },
    recommendations: [],
  },
  BX01: {
    id: 'BX01',
    name: 'Mott Haven',
    borough: 'Bronx',
    recommendations: [],
  },
  SI01: {
    id: 'SI01',
    name: 'St. George',
    borough: 'Staten Island',
    recommendations: [],
  },
};
