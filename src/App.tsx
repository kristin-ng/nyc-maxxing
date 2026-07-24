import { useState } from 'react';
import { SignInGate } from './components/auth/SignInGate';
import { NycMap } from './components/map/NycMap';
import { StatusPopup } from './components/popup/StatusPopup';
import { Sidebar } from './components/sidebar/Sidebar';
import { neighborhoods } from './data/neighborhoods';
import { useAuthStore } from './store/useAuthStore';
import './App.css';

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const selectedNeighborhood = selectedId ? neighborhoods[selectedId] : undefined;
  const user = useAuthStore((s) => s.user);
  const initializing = useAuthStore((s) => s.initializing);

  if (initializing) return null;
  if (!user) return <SignInGate />;

  return (
    <div className="app-layout">
      <button
        type="button"
        className="sidebar-toggle"
        aria-label={sidebarOpen ? 'Close stats panel' : 'Open stats panel'}
        aria-expanded={sidebarOpen}
        onClick={() => setSidebarOpen((open) => !open)}
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <NycMap onSelectNeighborhood={setSelectedId} />
      {selectedNeighborhood && (
        <StatusPopup
          neighborhood={selectedNeighborhood}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}

export default App;
