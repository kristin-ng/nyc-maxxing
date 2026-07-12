import type {
  BoroughName,
  NeighborhoodStaticData,
  NeighborhoodStatusMap,
  StatusCounts,
} from '../types/neighborhood';
import { isNonResidentialNta } from './nta';

export const ALL_BOROUGHS: BoroughName[] = [
  'Manhattan',
  'Brooklyn',
  'Queens',
  'Bronx',
  'Staten Island',
];

function emptyCounts(neighborhoodCount = 0): StatusCounts {
  return { lived: 0, visited: 0, wantToGo: 0, total: 0, visitedCount: 0, neighborhoodCount };
}

export interface BoroughStats {
  overall: StatusCounts;
  byBorough: Record<BoroughName, StatusCounts>;
}

export function computeBoroughStats(
  statuses: NeighborhoodStatusMap,
  neighborhoods: Record<string, NeighborhoodStaticData>
): BoroughStats {
  const populatedNeighborhoods = Object.values(neighborhoods).filter(
    (n) => !isNonResidentialNta(n.id)
  );

  const neighborhoodCountByBorough = Object.fromEntries(
    ALL_BOROUGHS.map((borough) => [borough, 0])
  ) as Record<BoroughName, number>;
  for (const neighborhood of populatedNeighborhoods) {
    neighborhoodCountByBorough[neighborhood.borough] += 1;
  }

  const overall = emptyCounts(populatedNeighborhoods.length);
  const byBorough = Object.fromEntries(
    ALL_BOROUGHS.map((borough) => [borough, emptyCounts(neighborhoodCountByBorough[borough])])
  ) as Record<BoroughName, StatusCounts>;

  for (const [id, status] of Object.entries(statuses)) {
    const neighborhood = neighborhoods[id];
    if (!neighborhood || isNonResidentialNta(id)) continue;

    overall.total += 1;
    const boroughCounts = byBorough[neighborhood.borough];
    boroughCounts.total += 1;

    if (status === 'lived') {
      overall.lived += 1;
      overall.visitedCount += 1;
      boroughCounts.lived += 1;
      boroughCounts.visitedCount += 1;
    } else if (status === 'visited') {
      overall.visited += 1;
      overall.visitedCount += 1;
      boroughCounts.visited += 1;
      boroughCounts.visitedCount += 1;
    } else if (status === 'want-to-go') {
      overall.wantToGo += 1;
      boroughCounts.wantToGo += 1;
    }
  }

  return { overall, byBorough };
}

export function percentageVisited(counts: StatusCounts): number {
  if (counts.neighborhoodCount === 0) return 0;
  return Math.round((counts.visitedCount / counts.neighborhoodCount) * 100);
}
