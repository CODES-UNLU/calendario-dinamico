export interface PosterLayoutMetrics {
  monthFontSize: number;
  calendarBlockHeight: number;
  cellSize: number;
  cellFontSize: number;
  weekdayHeight: number;
  weekdayFontSize: number;
  gridGap: number;
  eventTitleFontSize: number;
  eventDateFontSize: number;
  eventPaddingY: number;
}

/**
 * Calcula métricas tipográficas y de espaciado para que:
 * 1. Las casillas del calendario sean siempre cuadradas (cellSize x cellSize).
 * 2. El nombre vertical del mes tenga exactamente la misma altura que todo el bloque de calendario.
 * 3. El listado cronológico se adapte a meses de 4, 5 o 6 filas y distinta densidad.
 */
export function computePosterLayoutMetrics(
  monthNameLength: number,
  weekCount: number,
  eventCount: number
): PosterLayoutMetrics {
  const isSixWeeks = weekCount >= 6;
  const isDenseEvents = eventCount >= 9;
  const isMediumEvents = eventCount >= 6 && eventCount < 9;

  let cellSize = 62;
  if (isSixWeeks && isDenseEvents) {
    cellSize = 52;
  } else if (isSixWeeks || isDenseEvents) {
    cellSize = 56;
  } else if (isMediumEvents) {
    cellSize = 60;
  }

  const gridGap = isSixWeeks || isDenseEvents ? 10 : 12;
  const weekdayHeight = 28;
  const weekdayMarginBottom = 10;
  const calendarBlockHeight =
    weekdayHeight + weekdayMarginBottom + weekCount * cellSize + (weekCount - 1) * gridGap;

  // Tamaño de fuente Handjet proporcional para que el texto cubra la altura del calendario sin distorsión
  const rawMonthFontSize = Math.round(calendarBlockHeight / Math.max(monthNameLength * 0.45, 2.5));
  const monthFontSize = Math.max(84, Math.min(132, rawMonthFontSize));

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
    calendarBlockHeight,
    cellSize,
    cellFontSize: cellSize <= 54 ? 26 : 30,
    weekdayHeight,
    weekdayFontSize: 22,
    gridGap,
    eventTitleFontSize,
    eventDateFontSize,
    eventPaddingY,
  };
}
