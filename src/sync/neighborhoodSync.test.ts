import { describe, expect, it, vi } from 'vitest';
import { mergeStatuses } from './neighborhoodSync';

vi.mock('../lib/firebase', () => ({ auth: {}, db: {} }));
vi.mock('firebase/auth', () => ({ onAuthStateChanged: vi.fn() }));
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  onSnapshot: vi.fn(),
  setDoc: vi.fn(),
}));

describe('mergeStatuses', () => {
  it('keeps local-only keys not present remotely', () => {
    expect(mergeStatuses({ BK73: 'lived' }, {})).toEqual({ BK73: 'lived' });
  });

  it('adopts remote-only keys not present locally', () => {
    expect(mergeStatuses({}, { MN12: 'visited' })).toEqual({ MN12: 'visited' });
  });

  it('lets remote win on conflicting keys', () => {
    expect(mergeStatuses({ BK73: 'want-to-go' }, { BK73: 'lived' })).toEqual({ BK73: 'lived' });
  });

  it('unions disjoint keys from both sides', () => {
    expect(mergeStatuses({ BK73: 'lived' }, { MN12: 'visited' })).toEqual({
      BK73: 'lived',
      MN12: 'visited',
    });
  });
});
