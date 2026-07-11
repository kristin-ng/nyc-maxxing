import './MapTooltip.css';

interface MapTooltipProps {
  name: string;
  x: number;
  y: number;
}

export function MapTooltip({ name, x, y }: MapTooltipProps) {
  return (
    <div className="map-tooltip" style={{ left: x + 12, top: y + 12 }}>
      {name}
    </div>
  );
}
