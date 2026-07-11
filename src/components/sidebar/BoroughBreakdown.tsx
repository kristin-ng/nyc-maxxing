import { useState } from 'react';
import type { BoroughName, StatusCounts } from '../../types/neighborhood';
import { percentageVisited } from '../../utils/boroughStats';
import './BoroughBreakdown.css';

interface BoroughBreakdownProps {
  byBorough: Record<BoroughName, StatusCounts>;
  boroughs: BoroughName[];
}

export function BoroughBreakdown({ byBorough, boroughs }: BoroughBreakdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="borough-breakdown">
      <button
        type="button"
        className="borough-breakdown-trigger"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className={`borough-breakdown-arrow ${isOpen ? 'open' : ''}`}>&#9656;</span>
        By borough
      </button>

      {isOpen && (
        <ul className="borough-list">
          {boroughs.map((borough) => {
            const counts = byBorough[borough];
            const percentage = percentageVisited(counts);
            return (
              <li key={borough} className="borough-row">
                <div className="borough-row-header">
                  <span className="borough-name">{borough}</span>
                  <span className="borough-count">
                    {counts.visitedCount}/{counts.neighborhoodCount} &middot; {percentage}%
                  </span>
                </div>
                <div
                  className="progress-bar progress-bar--small"
                  role="progressbar"
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
