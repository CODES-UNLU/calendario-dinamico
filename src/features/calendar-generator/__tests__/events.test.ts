import { describe, expect, it } from 'vitest';
import { filterEventsForMonth, sortEvents, validateEventInput } from '../domain/events';
import type { CalendarEvent } from '../domain/types';

describe('events domain logic', () => {
  it('ordena cronológicamente y desempata alfabéticamente en la misma fecha', () => {
    const events: CalendarEvent[] = [
      { id: '1', title: 'Paro nodocente', date: '2026-11-12', color: '#28a745' },
      { id: '2', title: 'Feriado Nacional', date: '2026-11-09', color: '#1b5e34' },
      { id: '3', title: 'Charla en vivo', date: '2026-11-09', color: '#1b5e34' },
    ];

    const sorted = sortEvents(events);
    expect(sorted.map((e) => e.id)).toEqual(['3', '2', '1']);
  });

  it('valida título obligatorio, fecha válida y coincidencia con mes activo', () => {
    const emptyErrors = validateEventInput(
      { title: '   ', date: '2026-11-05', color: '#28a745' },
      2026,
      11
    );
    expect(emptyErrors.title).toBeDefined();
    expect(emptyErrors.date).toBeUndefined();

    const wrongMonthErrors = validateEventInput(
      { title: 'Evento', date: '2026-12-01', color: '#28a745' },
      2026,
      11
    );
    expect(wrongMonthErrors.date).toContain('11/2026');

    const invalidLeapErrors = validateEventInput(
      { title: 'Evento', date: '2026-02-29', color: '#28a745' },
      2026,
      2
    );
    expect(invalidLeapErrors.date).toBeDefined();
  });

  it('filtra únicamente acontecimientos del mes y año seleccionados', () => {
    const events: CalendarEvent[] = [
      { id: '1', title: 'Nov', date: '2026-11-03', color: '#28a745' },
      { id: '2', title: 'Dic', date: '2026-12-08', color: '#1b5e34' },
    ];
    expect(filterEventsForMonth(events, 2026, 11)).toHaveLength(1);
  });
});
