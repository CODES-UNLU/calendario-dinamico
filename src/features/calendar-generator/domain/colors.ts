export interface ColorPreset {
  label: string;
  hex: string;
}

/**
 * Escala oficial de verdes del gráfico de contribuciones de GitHub (modo oscuro),
 * ordenada de menor a mayor intensidad.
 */
export const GITHUB_CONTRIBUTION_GREENS: ColorPreset[] = [
  { label: 'Nivel 1 (verde oscuro)', hex: '#0e4429' },
  { label: 'Nivel 2 (verde medio)', hex: '#006d32' },
  { label: 'Nivel 3 (verde brillante)', hex: '#26a641' },
  { label: 'Nivel 4 (verde intenso)', hex: '#39d353' },
];

export const DEFAULT_EVENT_COLOR = '#26a641';

export const EVENT_COLOR_PRESETS = GITHUB_CONTRIBUTION_GREENS;
