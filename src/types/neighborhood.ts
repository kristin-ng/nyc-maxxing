export type BoroughName = 'Manhattan' | 'Brooklyn' | 'Queens' | 'Bronx' | 'Staten Island';

export type VisitStatus = 'lived' | 'visited' | 'want-to-go';

export interface Recommendation {
  id: string;
  title: string;
  description?: string;
  // Reserved for future Attractions/Food/History tabs; unused (flat list) in v1.
  category?: 'general' | 'attraction' | 'food' | 'history';
}

export interface CulturalFlag {
  hasNotableCulturalOrHistoricalSignificance: boolean;
  note?: string;
}

// Static, bundled with the app — not persisted to storage.
export interface NeighborhoodStaticData {
  id: string; // NTA2020 code, e.g. "BK73"
  name: string; // e.g. "Williamsburg"
  borough: BoroughName;
  culturalFlag?: CulturalFlag;
  recommendations: Recommendation[];
}

// User-generated, persisted, keyed by neighborhood id.
export type NeighborhoodStatusMap = Record<string, VisitStatus>;

export interface StatusCounts {
  lived: number;
  visited: number;
  wantToGo: number;
  total: number; // all marked neighborhoods, including want-to-go
  visitedCount: number; // lived + visited — want-to-go doesn't count as progress
  neighborhoodCount: number; // total neighborhoods in this scope (percentage denominator)
}
