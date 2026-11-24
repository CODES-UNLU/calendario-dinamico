export type EventCategory =
  | 'feriado'
  | 'asueto'
  | 'paro-docente'
  | 'paro-nodocente'
  | 'institucional'
  | 'charla-evento'
  | 'fecha-academica'
  | 'otro';

export interface CategoryMeta {
  id: EventCategory;
  label: string;
  defaultColor: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  /** Fecha en formato ISO local YYYY-MM-DD */
  date: string;
  category: EventCategory;
  /** Color hexadecimal opcional para sobrescribir el color de la categoría */
  customColor?: string;
}

export interface CalendarConfig {
  year: number;
  /** Mes 1-12 (1 = Enero, 12 = Diciembre) */
  month: number;
}

export interface CalendarCell {
  /** Número de día (1..31) o null si la celda está vacía */
  day: number | null;
  /** Fecha YYYY-MM-DD o null si la celda está vacía */
  dateStr: string | null;
  events: CalendarEvent[];
}

export interface CalendarGrid {
  year: number;
  month: number;
  monthName: string;
  weeks: CalendarCell[][];
}

