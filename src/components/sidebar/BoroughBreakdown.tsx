import { useState } from 'react';
import type { BoroughName, StatusCounts } from '../../types/neighborhood';
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
            return (
              <li key={borough} className="borough-row">
                <span className="borough-name">{borough}</span>
                <span className="borough-count">{counts.total}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
