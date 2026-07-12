import { describe, expect, it } from 'vitest';
import { computeBoroughStats, percentageVisited } from './boroughStats';
import type { NeighborhoodStaticData } from '../types/neighborhood';

const neighborhoods: Record<string, NeighborhoodStaticData> = {
  BK0102: { id: 'BK0102', name: 'Williamsburg', borough: 'Brooklyn', recommendations: [] },
  BK0104: { id: 'BK0104', name: 'East Williamsburg', borough: 'Brooklyn', recommendations: [] },
  MN40: { id: 'MN40', name: 'Upper East Side', borough: 'Manhattan', recommendations: [] },
};

describe('computeBoroughStats', () => {
  it('returns all-zero counts for an empty status map', () => {
    const { overall, byBorough } = computeBoroughStats({}, neighborhoods);
    expect(overall).toEqual({ lived: 0, visited: 0, wantToGo: 0, total: 0, visitedCount: 0, neighborhoodCount: 3 });
    expect(byBorough['Staten Island']).toEqual({
      lived: 0,
      visited: 0,
      wantToGo: 0,
      total: 0,
      visitedCount: 0,
      neighborhoodCount: 0,
    });
  });

  it('tallies overall and per-borough counts by status', () => {
    const { overall, byBorough } = computeBoroughStats(
      { BK0102: 'lived', BK0104: 'visited', MN40: 'want-to-go' },
      neighborhoods
    );
    expect(overall).toEqual({ lived: 1, visited: 1, wantToGo: 1, total: 3, visitedCount: 2, neighborhoodCount: 3 });
    expect(byBorough.Brooklyn).toEqual({
      lived: 1,
      visited: 1,
      wantToGo: 0,
      total: 2,
      visitedCount: 2,
      neighborhoodCount: 2,
    });
    expect(byBorough.Manhattan).toEqual({
      lived: 0,
      visited: 0,
      wantToGo: 1,
      total: 1,
      visitedCount: 0,
      neighborhoodCount: 1,
    });
    expect(byBorough.Queens).toEqual({
      lived: 0,
      visited: 0,
      wantToGo: 0,
      total: 0,
      visitedCount: 0,
      neighborhoodCount: 0,
    });
  });

  it('ignores statuses for ids not present in the static neighborhood data', () => {
    const { overall } = computeBoroughStats({ UNKNOWN: 'lived' }, neighborhoods);
    expect(overall.lived).toBe(0);
    expect(overall.visitedCount).toBe(0);
  });

  it('total equals the sum of the three status counts', () => {
    const { overall } = computeBoroughStats(
      { BK0102: 'lived', BK0104: 'visited', MN40: 'want-to-go' },
      neighborhoods
    );
    expect(overall.total).toBe(overall.lived + overall.visited + overall.wantToGo);
  });

  it('visitedCount excludes want-to-go', () => {
    const { overall } = computeBoroughStats(
      { BK0102: 'lived', BK0104: 'visited', MN40: 'want-to-go' },
      neighborhoods
    );
    expect(overall.visitedCount).toBe(overall.lived + overall.visited);
  });
});

describe('computeBoroughStats with non-residential NTAs (park/cemetery/airport ids)', () => {
  const neighborhoodsWithPark: Record<string, NeighborhoodStaticData> = {
    ...neighborhoods,
    BK9591: { id: 'BK9591', name: 'Prospect Park', borough: 'Brooklyn', recommendations: [] },
  };

  it('excludes non-residential NTAs from the neighborhood count', () => {
    const { overall, byBorough } = computeBoroughStats({}, neighborhoodsWithPark);
    expect(overall.neighborhoodCount).toBe(3);
    expect(byBorough.Brooklyn.neighborhoodCount).toBe(2);
  });

  it('ignores a status set on a non-residential NTA', () => {
    const { overall, byBorough } = computeBoroughStats({ BK9591: 'lived' }, neighborhoodsWithPark);
    expect(overall.lived).toBe(0);
    expect(overall.total).toBe(0);
    expect(byBorough.Brooklyn.lived).toBe(0);
  });
});

describe('percentageVisited', () => {
  it('returns 0 when there are no neighborhoods in scope', () => {
    expect(percentageVisited({ lived: 0, visited: 0, wantToGo: 0, total: 0, visitedCount: 0, neighborhoodCount: 0 })).toBe(0);
  });

  it('rounds visitedCount / neighborhoodCount to a whole percentage', () => {
    expect(
      percentageVisited({ lived: 1, visited: 0, wantToGo: 0, total: 1, visitedCount: 1, neighborhoodCount: 3 })
    ).toBe(33);
  });

  it('does not count want-to-go toward the percentage', () => {
    expect(
      percentageVisited({ lived: 0, visited: 0, wantToGo: 3, total: 3, visitedCount: 0, neighborhoodCount: 3 })
    ).toBe(0);
  });
});
