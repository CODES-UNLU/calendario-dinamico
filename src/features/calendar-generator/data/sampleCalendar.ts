import type { CalendarConfig, CalendarEvent } from '../domain/types';

export const SAMPLE_CALENDAR_CONFIG: CalendarConfig = {
  year: 2026,
  month: 11,
};

export const SAMPLE_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'sample-1',
    title: 'Paro nodocente',
    date: '2026-11-03',
    color: '#26a641',
  },
  {
    id: 'sample-2',
    title: 'Feriado Nacional por visita Papa León XIV',
    date: '2026-11-09',
    color: '#0e4429',
  },
  {
    id: 'sample-3',
    title: 'Charla profesional en vivo con Gabriel Tolosa',
    date: '2026-11-09',
    color: '#0e4429',
  },
  {
    id: 'sample-4',
    title: 'Asueto por visita Papa León XIV',
    date: '2026-11-11',
    color: '#39d353',
  },
  {
    id: 'sample-5',
    title: 'Paro nodocente',
    date: '2026-11-12',
    color: '#39d353',
  },
  {
    id: 'sample-6',
    title: 'Paro nodocente',
    date: '2026-11-16',
    color: '#26a641',
  },
  {
    id: 'sample-7',
    title: 'Día de la Soberanía Nacional',
    date: '2026-11-23',
    color: '#26a641',
  },
  {
    id: 'sample-8',
    title: 'Día del Nodocente (asueto administrativo)',
    date: '2026-11-26',
    color: '#39d353',
  },
];
