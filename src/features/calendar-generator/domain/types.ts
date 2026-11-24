export interface CalendarEvent {
  id: string;
  title: string;
  /** Fecha en formato ISO local YYYY-MM-DD */
  date: string;
  /** Color hexadecimal (#RRGGBB) para destacar la casilla en la grilla */
  color: string;
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
