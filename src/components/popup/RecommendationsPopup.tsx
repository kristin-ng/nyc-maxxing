import type { NeighborhoodStaticData } from '../../types/neighborhood';
import { Popup } from './Popup';
import './RecommendationsPopup.css';

interface RecommendationsPopupProps {
  neighborhood: NeighborhoodStaticData;
  onClose: () => void;
}

export function RecommendationsPopup({
  neighborhood,
  onClose,
}: RecommendationsPopupProps) {
  const { culturalFlag, recommendations } = neighborhood;
  const hasContent =
    (culturalFlag?.hasNotableCulturalOrHistoricalSignificance && culturalFlag.note) ||
    recommendations.length > 0;

  return (
    <Popup
      title={`What can I do in ${neighborhood.name}?`}
      onClose={onClose}
    >
      {culturalFlag?.hasNotableCulturalOrHistoricalSignificance && culturalFlag.note && (
        <div className="cultural-callout">{culturalFlag.note}</div>
      )}

      {recommendations.length > 0 ? (
        <ul className="recommendation-list">
          {recommendations.map((rec) => (
            <li key={rec.id} className="recommendation-item">
              <span className="recommendation-title">{rec.title}</span>
              {rec.description && (
                <span className="recommendation-description">{rec.description}</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        !hasContent && <p className="recommendation-empty">No recommendations yet.</p>
      )}
    </Popup>
  );
}
