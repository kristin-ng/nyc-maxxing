import { useMemo } from 'react';
import { useNeighborhoodStore } from '../../store/useNeighborhoodStore';
import { ALL_BOROUGHS, computeBoroughStats } from '../../utils/boroughStats';
import { neighborhoods } from '../../data/neighborhoods';
import { BoroughBreakdown } from './BoroughBreakdown';
import './Sidebar.css';

export function Sidebar() {
  const statuses = useNeighborhoodStore((s) => s.statuses);
  const { overall, byBorough } = useMemo(
    () => computeBoroughStats(statuses, neighborhoods),
    [statuses]
  );
  const totalNeighborhoods = Object.keys(neighborhoods).length;

  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">NYC Maxxing</h1>

      <div className="overall-stat">
        <span className="overall-stat-value">{overall.total}</span>
        <span className="overall-stat-label">
          of {totalNeighborhoods} neighborhoods
        </span>
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
  );
}
