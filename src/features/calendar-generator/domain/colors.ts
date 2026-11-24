export interface ColorPreset {
  label: string;
  hex: string;
}

export const DEFAULT_EVENT_COLOR = '#28a745';

export const EVENT_COLOR_PRESETS: ColorPreset[] = [
  { label: 'Verde medio', hex: '#28a745' },
  { label: 'Verde claro', hex: '#4cc764' },
  { label: 'Verde oscuro', hex: '#1b5e34' },
  { label: 'Turquesa CODES', hex: '#39c0c3' },
  { label: 'Azul', hex: '#4e6f9e' },
];
