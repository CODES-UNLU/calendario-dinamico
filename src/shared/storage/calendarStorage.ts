import { isValidCalendarDate, sortEvents } from '../../features/calendar-generator/domain/events';
import type { CalendarConfig, CalendarEvent } from '../../features/calendar-generator/domain/types';

const ACTIVE_CONFIG_KEY = 'codes:calendar:v1:active-config';
const MONTH_PREFIX = 'codes:calendar:v1:month:';

export interface CalendarDocumentV1 {
  schemaVersion: 1;
  config: CalendarConfig;
  events: CalendarEvent[];
  updatedAt: string;
}

function getMonthKey(year: number, month: number): string {
  return `${MONTH_PREFIX}${year}-${String(month).padStart(2, '0')}`;
}

export function loadActiveConfig(): CalendarConfig | null {
  try {
    const raw = localStorage.getItem(ACTIVE_CONFIG_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CalendarConfig>;
    if (
      typeof parsed.year === 'number' &&
      typeof parsed.month === 'number' &&
      parsed.month >= 1 &&
      parsed.month <= 12
    ) {
      return { year: parsed.year, month: parsed.month };
    }
    return null;
  } catch {
    return null;
  }
}

export function saveActiveConfig(config: CalendarConfig): void {
  try {
    localStorage.setItem(ACTIVE_CONFIG_KEY, JSON.stringify(config));
  } catch {
    // Ignorar errores de cuota o modo privado
  }
}

export function loadMonthEvents(year: number, month: number): CalendarEvent[] {
  try {
    const raw = localStorage.getItem(getMonthKey(year, month));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return sortEvents(parsed.filter(isValidStoredEvent));
  } catch {
    return [];
  }
}

export function saveMonthEvents(year: number, month: number, events: CalendarEvent[]): void {
  try {
    localStorage.setItem(getMonthKey(year, month), JSON.stringify(events));
  } catch {
    // Ignorar errores de cuota o modo privado
  }
}

function isValidStoredEvent(item: unknown): item is CalendarEvent {
  if (!item || typeof item !== 'object') return false;
  const ev = item as Record<string, unknown>;
  return (
    typeof ev.id === 'string' &&
    ev.id.length > 0 &&
    typeof ev.title === 'string' &&
    ev.title.trim().length > 0 &&
    typeof ev.date === 'string' &&
    isValidCalendarDate(ev.date) &&
    typeof ev.color === 'string' &&
    /^#[0-9a-fA-F]{6}$/.test(ev.color)
  );
}

export function serializeCalendarJson(config: CalendarConfig, events: CalendarEvent[]): string {
  const doc: CalendarDocumentV1 = {
    schemaVersion: 1,
    config,
    events: sortEvents(events),
    updatedAt: new Date().toISOString(),
  };
  return JSON.stringify(doc, null, 2);
}

export function parseCalendarJson(raw: string): CalendarDocumentV1 {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('El archivo no contiene un JSON válido.');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Estructura de calendario inválida.');
  }

  const doc = parsed as Record<string, unknown>;
  const config = doc.config as Record<string, unknown> | undefined;

  if (
    doc.schemaVersion !== 1 ||
    !config ||
    typeof config.year !== 'number' ||
    typeof config.month !== 'number' ||
    config.month < 1 ||
    config.month > 12 ||
    !Array.isArray(doc.events)
  ) {
    throw new Error('El archivo no corresponde a un borrador de calendario válido.');
  }

  const validEvents = doc.events.filter(isValidStoredEvent);
  if (validEvents.length !== doc.events.length) {
    throw new Error('Algunos acontecimientos del archivo tienen formato o fecha inválidos.');
  }

  return {
    schemaVersion: 1,
    config: { year: config.year, month: config.month },
    events: sortEvents(validEvents),
    updatedAt: typeof doc.updatedAt === 'string' ? doc.updatedAt : new Date().toISOString(),
  };
}

export function buildCalendarJsonFilename(monthName: string, year: number): string {
  const normalizedMonth = monthName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return `codes-calendario-${normalizedMonth}-${year}.json`;
}

export function downloadTextFile(filename: string, content: string, mimeType = 'application/json'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
