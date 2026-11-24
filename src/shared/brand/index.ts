import logoOscuroUrl from './assets/logo-oscuro.svg';
import logoClaroUrl from './assets/logo-claro.svg';
import logoMonoUrl from './assets/logo-mono.svg';
import logoAdaptableUrl from './assets/logo.svg';

export * from './tokens';

export const CODES_LOGOS = {
  oscuro: logoOscuroUrl,
  claro: logoClaroUrl,
  mono: logoMonoUrl,
  adaptable: logoAdaptableUrl,
} as const;
