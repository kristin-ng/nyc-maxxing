import { useAuthStore } from '../../store/useAuthStore';
import './AuthButton.css';

// Rendered only once App.tsx confirms a signed-in user via SignInGate.
export function AuthButton() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  if (!user) return null;

  return (
    <div className="auth-user">
      {user.photoURL && <img className="auth-user-avatar" src={user.photoURL} alt="" />}
      <span className="auth-user-name">{user.displayName ?? user.email}</span>
      <button type="button" className="auth-button auth-button--signout" onClick={() => void signOut()}>
        Sign out
      </button>
    </div>
  );
}
