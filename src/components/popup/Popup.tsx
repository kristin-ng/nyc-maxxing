import type { ReactNode } from 'react';
import './Popup.css';

interface PopupProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}

export function Popup({ title, subtitle, onClose, children }: PopupProps) {
  return (
    <div className="popup-backdrop" onClick={onClose}>
      <div className="popup-panel" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <div>
            <h2 className="popup-title">{title}</h2>
            {subtitle && <p className="popup-subtitle">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="popup-close"
            aria-label="Close"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="popup-body">{children}</div>
      </div>
    </div>
  );
}
