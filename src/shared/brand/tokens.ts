/**
 * Tokens institucionales del Centro Organizado de Estudiantes de Sistemas (CODES - UNLu).
 * Fuente de verdad: https://github.com/codes-unlu/Identidad-CODES
 */
export const CODES_TEAL_SCALE = {
  50: '#e7fafa',
  100: '#c8f3f4',
  200: '#95e7e8',
  300: '#5dd5d8', // --primary-light
  400: '#39c0c3', // --primary
  500: '#30a5a8',
  600: '#2a8a8d', // --primary-dark
  700: '#1d6d6f',
  800: '#125355',
  900: '#083b3c',
  950: '#022324',
} as const;

export const CODES_SURFACES = {
  base: '#0f0f0f',
  alt: '#1a1a1a',
  card: '#2d2d2d',
  elevated: '#3a3a3a',
  posterCard: '#121a24',
  posterCell: '#242e3b',
} as const;

export const CODES_TEXT = {
  primary: '#ffffff',
  secondary: '#e0e0e0',
  light: '#b0b0b0',
  muted: '#6c757d',
  posterEventTitle: '#628fd1',
  posterEventDate: '#9aa4b2',
} as const;

export const CODES_BORDERS = {
  default: '#404040',
  light: '#2d2d2d',
  glass: 'rgba(255, 255, 255, 0.1)',
  posterDivider: 'rgba(255, 255, 255, 0.14)',
} as const;

export const CODES_SEMANTIC = {
  success: '#51cf66',
  warning: '#ffd43b',
  danger: '#dc3545',
  info: '#0dcaf0',
} as const;

export const CODES_GRADIENTS = {
  primary: 'linear-gradient(135deg, #39c0c3 0%, #2a8a8d 100%)',
  light: 'linear-gradient(135deg, #5dd5d8 0%, #39c0c3 100%)',
} as const;

export const POSTER_TYPOGRAPHY = {
  monthDisplay: "'Handjet', sans-serif",
  calendarNumbers: "'Consolas', 'Inconsolata', monospace",
  body: "'Poppins', sans-serif",
} as const;

export const POSTER_DIMENSIONS = {
  width: 1080,
  height: 1350,
} as const;
