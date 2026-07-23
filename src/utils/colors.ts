import type { VisitStatus } from '../types/neighborhood';

export const STATUS_COLORS: Record<VisitStatus, string> = {
  lived: '#2f6f4f',
  visited: '#3d7dca',
  'want-to-go': '#d99a3d',
};

export const UNSET_COLOR = '#3a3a44';
export const NON_RESIDENTIAL_COLOR = '#5a5a63';
export const HOVER_STROKE = '#ffffff';

export const STATUS_LABELS: Record<VisitStatus, string> = {
  lived: 'Lived',
  visited: 'Visited',
  'want-to-go': 'Want to go',
};
