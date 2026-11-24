import { beforeEach, describe, expect, it } from 'vitest';
import {
  buildCalendarJsonFilename,
  loadActiveConfig,
  loadMonthEvents,
  parseCalendarJson,
  saveActiveConfig,
  saveMonthEvents,
  serializeCalendarJson,
} from '../calendarStorage';
import type { CalendarEvent } from '../../../features/calendar-generator/domain/types';

describe('calendarStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('guarda y recupera la configuración activa y eventos por mes', () => {
    const config = { year: 2026, month: 11 };
    const events: CalendarEvent[] = [
      { id: '1', title: 'Paro nodocente', date: '2026-11-03', color: '#26a641' },
    ];

    saveActiveConfig(config);
    saveMonthEvents(2026, 11, events);

    expect(loadActiveConfig()).toEqual(config);
    expect(loadMonthEvents(2026, 11)).toEqual(events);
    expect(loadMonthEvents(2026, 12)).toEqual([]);
  });

  it('serializa y parsea un archivo JSON válido de calendario', () => {
    const json = serializeCalendarJson(
      { year: 2026, month: 11 },
      [{ id: '1', title: 'Feriado', date: '2026-11-09', color: '#0e4429' }]
    );
    const parsed = parseCalendarJson(json);

    expect(parsed.config).toEqual({ year: 2026, month: 11 });
    expect(parsed.events).toHaveLength(1);
    expect(buildCalendarJsonFilename('Noviembre', 2026)).toBe(
      'codes-calendario-noviembre-2026.json'
    );
  });

  it('rechaza JSON corrupto o con esquema inválido', () => {
    expect(() => parseCalendarJson('{no-json')).toThrow(/JSON válido/i);
    expect(() => parseCalendarJson('{"schemaVersion":2}')).toThrow(/borrador de calendario/i);
  });
});
