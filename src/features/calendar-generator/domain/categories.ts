import type { CategoryMeta, EventCategory } from './types';

export const EVENT_CATEGORIES: Record<EventCategory, CategoryMeta> = {
  feriado: {
    id: 'feriado',
    label: 'Feriado',
    defaultColor: '#1b5e34',
  },
  asueto: {
    id: 'asueto',
    label: 'Asueto',
    defaultColor: '#4cc764',
  },
  'paro-docente': {
    id: 'paro-docente',
    label: 'Paro docente',
    defaultColor: '#2ea043',
  },
  'paro-nodocente': {
    id: 'paro-nodocente',
    label: 'Paro nodocente',
    defaultColor: '#28a745',
  },
  institucional: {
    id: 'institucional',
    label: 'Actividad institucional',
    defaultColor: '#39c0c3',
  },
  'charla-evento': {
    id: 'charla-evento',
    label: 'Charla o evento',
    defaultColor: '#2a8a8d',
  },
  'fecha-academica': {
    id: 'fecha-academica',
    label: 'Fecha académica',
    defaultColor: '#5dd5d8',
  },
  otro: {
    id: 'otro',
    label: 'Otro',
    defaultColor: '#4e6f9e',
  },
};

export const EVENT_CATEGORY_LIST: CategoryMeta[] = Object.values(EVENT_CATEGORIES);

export function getEventColor(category: EventCategory, customColor?: string): string {
  if (customColor && /^#[0-9a-fA-F]{6}$/.test(customColor)) {
    return customColor;
  }
  return EVENT_CATEGORIES[category].defaultColor;
}

