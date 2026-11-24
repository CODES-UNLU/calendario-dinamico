export interface PosterLayoutMetrics {
  monthFontSize: number;
  cellHeight: number;
  cellFontSize: number;
  weekdayFontSize: number;
  gridGap: number;
  eventTitleFontSize: number;
  eventDateFontSize: number;
  eventPaddingY: number;
}

/**
 * Calcula métricas tipográficas y de espaciado para que la pieza de 1080×1350
 * se adapte a meses de 4, 5 o 6 filas, nombres de mes de distinta longitud
 * y distinta densidad de acontecimientos sin perder legibilidad.
 */
export function computePosterLayoutMetrics(
  monthNameLength: number,
  weekCount: number,
  eventCount: number
): PosterLayoutMetrics {
  const isSixWeeks = weekCount >= 6;
  const isDenseEvents = eventCount >= 9;
  const isMediumEvents = eventCount >= 6 && eventCount < 9;

  // Altura de celda adaptativa según semanas y densidad de eventos
  let cellHeight = 68;
  if (isSixWeeks && isDenseEvents) {
    cellHeight = 52;
  } else if (isSixWeeks || isDenseEvents) {
    cellHeight = 58;
  } else if (isMediumEvents) {
    cellHeight = 62;
  }

  const gridGap = isSixWeeks || isDenseEvents ? 10 : 12;
  const totalGridHeight = weekCount * cellHeight + (weekCount - 1) * gridGap + 36;

  // Ajustar el tamaño del mes vertical (Handjet) para que no desborde la altura de la grilla
  const baseMonthSize = Math.round((totalGridHeight / Math.max(monthNameLength * 0.56, 3.6)) * 0.95);
  const monthFontSize = Math.max(76, Math.min(124, baseMonthSize));

  // Tipografía del listado cronológico (Poppins) con piso legible
  let eventTitleFontSize = 24;
  let eventDateFontSize = 19;
  let eventPaddingY = 12;

  if (isDenseEvents) {
    eventTitleFontSize = 20;
    eventDateFontSize = 16;
    eventPaddingY = 8;
  } else if (isMediumEvents || isSixWeeks) {
    eventTitleFontSize = 22;
    eventDateFontSize = 18;
    eventPaddingY = 10;
  }

  return {
    monthFontSize,
    cellHeight,
    cellFontSize: cellHeight <= 54 ? 27 : 31,
    weekdayFontSize: 22,
    gridGap,
    eventTitleFontSize,
    eventDateFontSize,
    eventPaddingY,
  };
}
