import { describe, expect, it } from 'vitest';
import {
  formatEventDate,
  generateCalendarGrid,
  getDaysInMonth,
  isLeapYear,
} from '../domain/calendarGrid';
import type { CalendarEvent } from '../domain/types';

describe('calendarGrid domain logic', () => {
  it('identifica correctamente años bisiestos y no bisiestos', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2026)).toBe(false);
  });

  it('calcula la duración correcta de cada mes incluyendo febrero bisiesto', () => {
    expect(getDaysInMonth(2024, 2)).toBe(29);
    expect(getDaysInMonth(2026, 2)).toBe(28);
    expect(getDaysInMonth(2026, 11)).toBe(30);
    expect(getDaysInMonth(2026, 12)).toBe(31);
  });

  it('genera un mes de 4 filas exactas cuando febrero de 28 días empieza en lunes (Feb 2027)', () => {
    const grid = generateCalendarGrid(2027, 2);
    expect(grid.monthName).toBe('Febrero');
    expect(grid.weeks).toHaveLength(4);
    expect(grid.weeks[0][0].day).toBe(1);
    expect(grid.weeks[3][6].day).toBe(28);
  });

  it('genera un mes de 6 filas cuando corresponde (Agosto 2026)', () => {
    const grid = generateCalendarGrid(2026, 8);
    expect(grid.weeks).toHaveLength(6);
    expect(grid.weeks[0].slice(0, 5).every((c) => c.day === null)).toBe(true);
    expect(grid.weeks[0][5].day).toBe(1);
    expect(grid.weeks[5][0].day).toBe(31);
  });

  it('ubica noviembre 2026 comenzando en domingo (índice 6)', () => {
    const grid = generateCalendarGrid(2026, 11);
    expect(grid.weeks).toHaveLength(6);
    expect(grid.weeks[0][6].day).toBe(1);
    expect(grid.weeks[1][2].day).toBe(4);
    expect(grid.weeks[5][0].day).toBe(30);
  });

  it('asocia múltiples acontecimientos a una misma fecha en la grilla', () => {
    const events: CalendarEvent[] = [
      { id: '1', title: 'Feriado', date: '2026-11-09', color: '#1b5e34' },
      { id: '2', title: 'Charla', date: '2026-11-09', color: '#1b5e34' },
    ];
    const grid = generateCalendarGrid(2026, 11, events);
    const allCells = grid.weeks.flat();
    const nov9 = allCells.find((c) => c.dateStr === '2026-11-09');
    expect(nov9?.events).toHaveLength(2);
  });

  it('formatea fechas ISO locales en español', () => {
    expect(formatEventDate('2026-11-03')).toBe('3 de noviembre');
    expect(formatEventDate('2026-02-29')).toBe('29 de febrero');
  });
});
