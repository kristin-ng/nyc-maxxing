import type {
  BoroughName,
  NeighborhoodStaticData,
  NeighborhoodStatusMap,
  StatusCounts,
} from '../types/neighborhood';

export const ALL_BOROUGHS: BoroughName[] = [
  'Manhattan',
  'Brooklyn',
  'Queens',
  'Bronx',
  'Staten Island',
];

function emptyCounts(): StatusCounts {
  return { lived: 0, visited: 0, wantToGo: 0, total: 0 };
}

export interface BoroughStats {
  overall: StatusCounts;
  byBorough: Record<BoroughName, StatusCounts>;
}

export function computeBoroughStats(
  statuses: NeighborhoodStatusMap,
  neighborhoods: Record<string, NeighborhoodStaticData>
): BoroughStats {
  const overall = emptyCounts();
  const byBorough = Object.fromEntries(
    ALL_BOROUGHS.map((borough) => [borough, emptyCounts()])
  ) as Record<BoroughName, StatusCounts>;

  for (const [id, status] of Object.entries(statuses)) {
    const neighborhood = neighborhoods[id];
    if (!neighborhood) continue;

    overall.total += 1;
    const boroughCounts = byBorough[neighborhood.borough];
    boroughCounts.total += 1;

    if (status === 'lived') {
      overall.lived += 1;
      boroughCounts.lived += 1;
    } else if (status === 'visited') {
      overall.visited += 1;
      boroughCounts.visited += 1;
    } else if (status === 'want-to-go') {
      overall.wantToGo += 1;
      boroughCounts.wantToGo += 1;
    }
  }

  return { overall, byBorough };
}
