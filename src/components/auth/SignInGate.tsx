import { useAuthStore } from '../../store/useAuthStore';
import './SignInGate.css';

export function SignInGate() {
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);

  return (
    <div className="sign-in-gate">
      <h1 className="sign-in-gate-title">NYC Maxxing</h1>
      <p className="sign-in-gate-subtitle">Sign in to track and sync your progress across devices.</p>
      <button type="button" className="sign-in-gate-button" onClick={() => void signInWithGoogle()}>
        Sign in with Google
      </button>
    </div>
  );
}
