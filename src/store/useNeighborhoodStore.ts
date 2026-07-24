import { deleteField, doc, setDoc, updateDoc } from 'firebase/firestore';
import { create } from 'zustand';
import { db } from '../lib/firebase';
import { localStorageNeighborhoodStore } from '../storage/neighborhoodStorage';
import type { NeighborhoodStatusMap, VisitStatus } from '../types/neighborhood';
import { useAuthStore } from './useAuthStore';

interface NeighborhoodStoreState {
  statuses: NeighborhoodStatusMap;
  setStatus: (id: string, status: VisitStatus | null) => void;
}

function pushRemoteStatus(id: string, status: VisitStatus | null): void {
  const { user } = useAuthStore.getState();
  if (!user) return;
  const userDoc = doc(db, 'users', user.uid);
  if (status === null) {
    void updateDoc(userDoc, { [`statuses.${id}`]: deleteField() });
  } else {
    void setDoc(userDoc, { statuses: { [id]: status } }, { merge: true });
  }
}

export const useNeighborhoodStore = create<NeighborhoodStoreState>((set) => ({
  statuses: localStorageNeighborhoodStore.getAllStatuses(),
  setStatus: (id, status) => {
    localStorageNeighborhoodStore.setStatus(id, status);
    pushRemoteStatus(id, status);
    set((state) => {
      const next = { ...state.statuses };
      if (status === null) delete next[id];
      else next[id] = status;
      return { statuses: next };
    });
  },
}));
