import { beforeEach, describe, expect, it } from 'vitest';
import { localStorageNeighborhoodStore } from './neighborhoodStorage';

const STORAGE_KEY = 'nyc-maxxing:v1';

beforeEach(() => {
  localStorage.clear();
});

describe('localStorageNeighborhoodStore', () => {
  it('returns null for an unset neighborhood', () => {
    expect(localStorageNeighborhoodStore.getStatus('BK73')).toBeNull();
  });

  it('round-trips a status through get/set', () => {
    localStorageNeighborhoodStore.setStatus('BK73', 'lived');
    expect(localStorageNeighborhoodStore.getStatus('BK73')).toBe('lived');
    expect(localStorageNeighborhoodStore.getAllStatuses()).toEqual({ BK73: 'lived' });
  });

  it('overwrites an existing status', () => {
    localStorageNeighborhoodStore.setStatus('BK73', 'want-to-go');
    localStorageNeighborhoodStore.setStatus('BK73', 'visited');
    expect(localStorageNeighborhoodStore.getStatus('BK73')).toBe('visited');
  });

  it('clears a status when set to null', () => {
    localStorageNeighborhoodStore.setStatus('BK73', 'lived');
    localStorageNeighborhoodStore.setStatus('BK73', null);
    expect(localStorageNeighborhoodStore.getStatus('BK73')).toBeNull();
    expect(localStorageNeighborhoodStore.getAllStatuses()).toEqual({});
  });

  it('keeps multiple neighborhoods independent', () => {
    localStorageNeighborhoodStore.setStatus('BK73', 'lived');
    localStorageNeighborhoodStore.setStatus('MN12', 'want-to-go');
    expect(localStorageNeighborhoodStore.getAllStatuses()).toEqual({
      BK73: 'lived',
      MN12: 'want-to-go',
    });
  });

  it('recovers from corrupt JSON in storage', () => {
    localStorage.setItem(STORAGE_KEY, '{not valid json');
    expect(localStorageNeighborhoodStore.getAllStatuses()).toEqual({});
    // and remains writable afterwards
    localStorageNeighborhoodStore.setStatus('BK73', 'visited');
    expect(localStorageNeighborhoodStore.getStatus('BK73')).toBe('visited');
  });

  it('falls back to empty state on a version mismatch', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 99, statuses: { BK73: 'lived' } }));
    expect(localStorageNeighborhoodStore.getAllStatuses()).toEqual({});
  });
});
