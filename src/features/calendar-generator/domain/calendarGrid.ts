import type { CalendarCell, CalendarEvent, CalendarGrid } from './types';

export const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
] as const;

export const WEEKDAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'] as const;

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getDaysInMonth(year: number, month: number): number {
  if (month < 1 || month > 12) {
    throw new RangeError(`Mes inválido: ${month}. Debe estar entre 1 y 12.`);
  }
  const daysPerMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysPerMonth[month - 1];
}

export function getMonthName(month: number): string {
  if (month < 1 || month > 12) {
    throw new RangeError(`Mes inválido: ${month}. Debe estar entre 1 y 12.`);
  }
  return MONTH_NAMES[month - 1];
}

export function formatDateISO(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

/**
 * Formatea "2026-11-03" -> "3 de noviembre"
 */
export function formatEventDate(dateStr: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return dateStr;
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12) return dateStr;
  return `${day} de ${getMonthName(month).toLowerCase()}`;
}

/**
 * Índice del día de la semana comenzando en lunes (0 = Lunes, 6 = Domingo).
 */
export function getMondayFirstWeekday(year: number, month: number, day: number): number {
  const jsDay = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return (jsDay + 6) % 7;
}

export function generateCalendarGrid(
  year: number,
  month: number,
  events: CalendarEvent[] = []
): CalendarGrid {
  const totalDays = getDaysInMonth(year, month);
  const startOffset = getMondayFirstWeekday(year, month, 1);

  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const existing = eventsByDate.get(event.date);
    if (existing) {
      existing.push(event);
    } else {
      eventsByDate.set(event.date, [event]);
    }
  }

  const cells: CalendarCell[] = [];

  for (let i = 0; i < startOffset; i++) {
    cells.push({ day: null, dateStr: null, events: [] });
  }

  for (let day = 1; day <= totalDays; day++) {
    const dateStr = formatDateISO(year, month, day);
    cells.push({
      day,
      dateStr,
      events: eventsByDate.get(dateStr) ?? [],
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ day: null, dateStr: null, events: [] });
  }

  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return {
    year,
    month,
    monthName: getMonthName(month),
    weeks,
  };
}

