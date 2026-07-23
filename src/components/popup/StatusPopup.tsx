import { useState } from 'react';
import type { NeighborhoodStaticData, VisitStatus } from '../../types/neighborhood';
import { useNeighborhoodStore } from '../../store/useNeighborhoodStore';
import { STATUS_LABELS } from '../../utils/colors';
import { Popup } from './Popup';
import { CollapsibleSection } from './CollapsibleSection';
import { RecommendationsPopup } from './RecommendationsPopup';
import './StatusPopup.css';

interface StatusPopupProps {
  neighborhood: NeighborhoodStaticData;
  onClose: () => void;
}

const STATUS_OPTIONS: VisitStatus[] = ['lived', 'visited', 'want-to-go'];

export function StatusPopup({ neighborhood, onClose }: StatusPopupProps) {
  const status = useNeighborhoodStore((s) => s.statuses[neighborhood.id] ?? null);
  const setStatus = useNeighborhoodStore((s) => s.setStatus);
  const [showRecommendations, setShowRecommendations] = useState(false);

  function handleStatusClick(next: VisitStatus) {
    setStatus(neighborhood.id, status === next ? null : next);
    onClose();
  }

  return (
    <>
      <Popup
        title={neighborhood.name}
        subtitle={neighborhood.borough}
        onClose={onClose}
      >
        <div className="status-options">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`status-option status-option--${option} ${status === option ? 'active' : ''}`}
              onClick={() => handleStatusClick(option)}
            >
              {STATUS_LABELS[option]}
            </button>
          ))}
        </div>

        <CollapsibleSection title="What can I do there?">
          <button
            type="button"
            className="recommendations-trigger"
            onClick={() => setShowRecommendations(true)}
          >
            See recommendations
          </button>
        </CollapsibleSection>
      </Popup>

      {showRecommendations && (
        <RecommendationsPopup
          neighborhood={neighborhood}
          onClose={() => setShowRecommendations(false)}
        />
      )}
    </>
  );
}
