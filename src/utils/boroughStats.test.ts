import { describe, expect, it } from 'vitest';
import { computeBoroughStats } from './boroughStats';
import type { NeighborhoodStaticData } from '../types/neighborhood';

const neighborhoods: Record<string, NeighborhoodStaticData> = {
  BK73: { id: 'BK73', name: 'Williamsburg', borough: 'Brooklyn', recommendations: [] },
  BK90: { id: 'BK90', name: 'East Williamsburg', borough: 'Brooklyn', recommendations: [] },
  MN40: { id: 'MN40', name: 'Upper East Side', borough: 'Manhattan', recommendations: [] },
};

describe('computeBoroughStats', () => {
  it('returns all-zero counts for an empty status map', () => {
    const { overall, byBorough } = computeBoroughStats({}, neighborhoods);
    expect(overall).toEqual({ lived: 0, visited: 0, wantToGo: 0, total: 0 });
    expect(byBorough['Staten Island']).toEqual({ lived: 0, visited: 0, wantToGo: 0, total: 0 });
  });

  it('tallies overall and per-borough counts by status', () => {
    const { overall, byBorough } = computeBoroughStats(
      { BK73: 'lived', BK90: 'visited', MN40: 'want-to-go' },
      neighborhoods
    );
    expect(overall).toEqual({ lived: 1, visited: 1, wantToGo: 1, total: 3 });
    expect(byBorough.Brooklyn).toEqual({ lived: 1, visited: 1, wantToGo: 0, total: 2 });
    expect(byBorough.Manhattan).toEqual({ lived: 0, visited: 0, wantToGo: 1, total: 1 });
    expect(byBorough.Queens).toEqual({ lived: 0, visited: 0, wantToGo: 0, total: 0 });
  });

  it('ignores statuses for ids not present in the static neighborhood data', () => {
    const { overall } = computeBoroughStats({ UNKNOWN: 'lived' }, neighborhoods);
    expect(overall).toEqual({ lived: 0, visited: 0, wantToGo: 0, total: 0 });
  });

  it('total equals the sum of the three status counts', () => {
    const { overall } = computeBoroughStats(
      { BK73: 'lived', BK90: 'visited', MN40: 'want-to-go' },
      neighborhoods
    );
    expect(overall.total).toBe(overall.lived + overall.visited + overall.wantToGo);
  });
});
