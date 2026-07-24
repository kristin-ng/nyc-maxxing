import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, type User } from 'firebase/auth';
import { create } from 'zustand';
import { auth } from '../lib/firebase';

interface AuthStoreState {
  user: User | null;
  initializing: boolean;
  setUser: (user: User | null) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  initializing: true,
  setUser: (user) => set({ user, initializing: false }),
  signInWithGoogle: async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  },
  signOut: async () => {
    await firebaseSignOut(auth);
  },
}));
