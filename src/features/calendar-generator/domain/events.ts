import { getDaysInMonth } from './calendarGrid';
import type { CalendarEvent, EventCategory } from './types';

export interface EventFormInput {
  title: string;
  date: string;
  category: EventCategory;
  customColor?: string;
}

export interface EventValidationErrors {
  title?: string;
  date?: string;
  customColor?: string;
}

export function sortEvents(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => {
    const dateCmp = a.date.localeCompare(b.date);
    if (dateCmp !== 0) return dateCmp;
    return a.title.localeCompare(b.title, 'es');
  });
}

export function isValidCalendarDate(dateStr: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12) return false;
  const maxDay = getDaysInMonth(year, month);
  return day >= 1 && day <= maxDay;
}

export function validateEventInput(
  input: EventFormInput,
  activeYear?: number,
  activeMonth?: number
): EventValidationErrors {
  const errors: EventValidationErrors = {};

  if (!input.title.trim()) {
    errors.title = 'El título es obligatorio.';
  } else if (input.title.trim().length > 120) {
    errors.title = 'El título no debe superar los 120 caracteres.';
  }

  if (!input.date) {
    errors.date = 'La fecha es obligatoria.';
  } else if (!isValidCalendarDate(input.date)) {
    errors.date = 'La fecha ingresada no es válida.';
  } else if (activeYear !== undefined && activeMonth !== undefined) {
    const [y, m] = input.date.split('-').map(Number);
    if (y !== activeYear || m !== activeMonth) {
      errors.date = `La fecha debe corresponder al mes seleccionado (${String(activeMonth).padStart(2, '0')}/${activeYear}).`;
    }
  }

  if (input.customColor && !/^#[0-9a-fA-F]{6}$/.test(input.customColor)) {
    errors.customColor = 'El color debe tener formato hexadecimal (#RRGGBB).';
  }

  return errors;
}

export function filterEventsForMonth(
  events: CalendarEvent[],
  year: number,
  month: number
): CalendarEvent[] {
  const prefix = `${year}-${String(month).padStart(2, '0')}-`;
  return sortEvents(events.filter((ev) => ev.date.startsWith(prefix)));
}

