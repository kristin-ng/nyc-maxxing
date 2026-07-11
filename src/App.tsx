import { useState } from 'react';
import { NycMap } from './components/map/NycMap';
import { StatusPopup } from './components/popup/StatusPopup';
import { Sidebar } from './components/sidebar/Sidebar';
import { neighborhoods } from './data/neighborhoods';
import './App.css';

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const selectedNeighborhood = selectedId ? neighborhoods[selectedId] : undefined;

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
