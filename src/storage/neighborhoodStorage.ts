import type { NeighborhoodStatusMap, VisitStatus } from '../types/neighborhood';

export interface NeighborhoodStore {
  getStatus(id: string): VisitStatus | null;
  setStatus(id: string, status: VisitStatus | null): void;
  getAllStatuses(): NeighborhoodStatusMap;
}

const STORAGE_KEY = 'nyc-maxxing:v1';
const STORAGE_VERSION = 1;

interface PersistedShape {
  version: typeof STORAGE_VERSION;
  statuses: NeighborhoodStatusMap;
}

function emptyState(): PersistedShape {
  return { version: STORAGE_VERSION, statuses: {} };
}

function readAll(): PersistedShape {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as PersistedShape;
    if (parsed.version !== STORAGE_VERSION || typeof parsed.statuses !== 'object' || parsed.statuses === null) {
      return emptyState();
    }
    return parsed;
  } catch {
    return emptyState();
  }
}

function writeAll(data: PersistedShape): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // e.g. Safari private mode / quota exceeded — swallow, UI still works this session
  }
}

export const localStorageNeighborhoodStore: NeighborhoodStore = {
  getStatus(id) {
    return readAll().statuses[id] ?? null;
  },
  setStatus(id, status) {
    const data = readAll();
    if (status === null) {
      delete data.statuses[id];
    } else {
      data.statuses[id] = status;
    }
    writeAll(data);
  },
  getAllStatuses() {
    return readAll().statuses;
  },
};
