import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../lib/firebase', () => ({ auth: {}, db: {} }));
vi.mock('firebase/firestore', () => ({
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteField: vi.fn(() => 'DELETE_FIELD_SENTINEL'),
  doc: vi.fn((_db: unknown, collection: string, id: string) => `${collection}/${id}`),
}));

import { setDoc, updateDoc } from 'firebase/firestore';
import { useAuthStore } from './useAuthStore';
import { useNeighborhoodStore } from './useNeighborhoodStore';

beforeEach(() => {
  localStorage.clear();
  vi.mocked(setDoc).mockClear();
  vi.mocked(updateDoc).mockClear();
  useNeighborhoodStore.setState({ statuses: {} });
  useAuthStore.setState({ user: null, initializing: false });
});

describe('useNeighborhoodStore.setStatus remote sync', () => {
  it('does not touch Firestore when signed out', () => {
    useNeighborhoodStore.getState().setStatus('BK73', 'lived');
    expect(setDoc).not.toHaveBeenCalled();
    expect(updateDoc).not.toHaveBeenCalled();
  });

  it('writes to Firestore when signed in', () => {
    useAuthStore.setState({ user: { uid: 'user-1' } as never, initializing: false });
    useNeighborhoodStore.getState().setStatus('BK73', 'lived');
    expect(setDoc).toHaveBeenCalledWith('users/user-1', { statuses: { BK73: 'lived' } }, { merge: true });
  });

  it('deletes the remote field when clearing a status while signed in', () => {
    useAuthStore.setState({ user: { uid: 'user-1' } as never, initializing: false });
    useNeighborhoodStore.getState().setStatus('BK73', null);
    expect(updateDoc).toHaveBeenCalledWith('users/user-1', { 'statuses.BK73': 'DELETE_FIELD_SENTINEL' });
  });

  it('still updates local state and storage regardless of auth state', () => {
    useNeighborhoodStore.getState().setStatus('BK73', 'visited');
    expect(useNeighborhoodStore.getState().statuses).toEqual({ BK73: 'visited' });
  });
});
