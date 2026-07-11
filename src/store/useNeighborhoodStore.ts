import { create } from 'zustand';
import { localStorageNeighborhoodStore } from '../storage/neighborhoodStorage';
import type { NeighborhoodStatusMap, VisitStatus } from '../types/neighborhood';

interface NeighborhoodStoreState {
  statuses: NeighborhoodStatusMap;
  setStatus: (id: string, status: VisitStatus | null) => void;
}

export const useNeighborhoodStore = create<NeighborhoodStoreState>((set) => ({
  statuses: localStorageNeighborhoodStore.getAllStatuses(),
  setStatus: (id, status) => {
    localStorageNeighborhoodStore.setStatus(id, status);
    set((state) => {
      const next = { ...state.statuses };
      if (status === null) delete next[id];
      else next[id] = status;
      return { statuses: next };
    });
  },
}));
