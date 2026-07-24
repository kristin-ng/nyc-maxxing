import { useMemo } from 'react';
import { useNeighborhoodStore } from '../../store/useNeighborhoodStore';
import { ALL_BOROUGHS, computeBoroughStats, percentageVisited } from '../../utils/boroughStats';
import { neighborhoods } from '../../data/neighborhoods';
import { AuthButton } from '../auth/AuthButton';
import { BoroughBreakdown } from './BoroughBreakdown';
import './Sidebar.css';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const statuses = useNeighborhoodStore((s) => s.statuses);
  const { overall, byBorough } = useMemo(
    () => computeBoroughStats(statuses, neighborhoods),
    [statuses]
  );
  const percentage = percentageVisited(overall);

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <h1 className="sidebar-title">NYC Maxxing</h1>
        <AuthButton />

        <div className="overall-stat">
          <span className="overall-stat-value">{overall.visitedCount}</span>
          <span className="overall-stat-label">
            of {overall.neighborhoodCount} neighborhoods visited
          </span>
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
          </div>
          <span className="overall-stat-percentage">{percentage}%</span>
        </div>

        <ul className="status-breakdown">
          <li className="status-breakdown-row status-breakdown-row--lived">
            <span>Lived</span>
            <span>{overall.lived}</span>
          </li>
          <li className="status-breakdown-row status-breakdown-row--visited">
            <span>Visited</span>
            <span>{overall.visited}</span>
          </li>
          <li className="status-breakdown-row status-breakdown-row--want-to-go">
            <span>Want to go</span>
            <span>{overall.wantToGo}</span>
          </li>
        </ul>

        <BoroughBreakdown byBorough={byBorough} boroughs={ALL_BOROUGHS} />
      </aside>
    </>
  );
}
