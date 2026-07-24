import { onAuthStateChanged, type Unsubscribe } from 'firebase/auth';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { localStorageNeighborhoodStore } from '../storage/neighborhoodStorage';
import { useAuthStore } from '../store/useAuthStore';
import { useNeighborhoodStore } from '../store/useNeighborhoodStore';
import type { NeighborhoodStatusMap } from '../types/neighborhood';

let detachSnapshotListener: Unsubscribe | null = null;

function applyStatuses(statuses: NeighborhoodStatusMap): void {
  useNeighborhoodStore.setState({ statuses });
  localStorageNeighborhoodStore.replaceAll(statuses);
}

// Remote wins on conflicting keys; local-only keys (not yet synced) are preserved.
export function mergeStatuses(
  local: NeighborhoodStatusMap,
  remote: NeighborhoodStatusMap
): NeighborhoodStatusMap {
  return { ...local, ...remote };
}

async function startUserSync(uid: string): Promise<void> {
  const userDoc = doc(db, 'users', uid);
  const snapshot = await getDoc(userDoc);
  const local = useNeighborhoodStore.getState().statuses;
  const remote = (snapshot.exists() ? snapshot.data().statuses : undefined) ?? {};
  const merged = mergeStatuses(local, remote);

  applyStatuses(merged);
  await setDoc(userDoc, { statuses: merged, updatedAt: Date.now() }, { merge: true });

  detachSnapshotListener = onSnapshot(userDoc, (docSnapshot) => {
    const remoteStatuses = (docSnapshot.data()?.statuses as NeighborhoodStatusMap | undefined) ?? {};
    applyStatuses(remoteStatuses);
  });
}

function stopUserSync(): void {
  detachSnapshotListener?.();
  detachSnapshotListener = null;
}

export function initSync(): Unsubscribe {
  return onAuthStateChanged(auth, (user) => {
    stopUserSync();
    useAuthStore.getState().setUser(user);
    if (user) {
      void startUserSync(user.uid);
    }
  });
}
