export type PosterEventsLayoutMode = 'list' | 'cards-2col';

export interface PosterLayoutMetrics {
  layoutMode: PosterEventsLayoutMode;
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
 * Calcula métricas tipográficas y de espaciado para la pieza gráfica.
 * - Hasta 6 acontecimientos: listado vertical clásico con separadores.
 * - 7 o más acontecimientos: cambia automáticamente a grilla de tarjetas en 2 columnas.
 */
export function computePosterLayoutMetrics(
  monthNameLength: number,
  weekCount: number,
  eventCount: number
): PosterLayoutMetrics {
  const layoutMode: PosterEventsLayoutMode = eventCount >= 7 ? 'cards-2col' : 'list';
  const isSixWeeks = weekCount >= 6;
  const isDenseEvents = eventCount >= 10;

  let cellSize = 62;
  if (isSixWeeks && isDenseEvents) {
    cellSize = 54;
  } else if (isSixWeeks || isDenseEvents) {
    cellSize = 58;
  }

  const gridGap = isSixWeeks || isDenseEvents ? 10 : 12;
  const weekdayHeight = 28;
  const weekdayMarginBottom = 10;
  const calendarBlockHeight =
    weekdayHeight + weekdayMarginBottom + weekCount * cellSize + (weekCount - 1) * gridGap;

  const rawMonthFontSize = Math.round(calendarBlockHeight / Math.max(monthNameLength * 0.45, 2.5));
  const monthFontSize = Math.max(84, Math.min(132, rawMonthFontSize));

  const eventTitleFontSize = layoutMode === 'cards-2col' ? 21 : 24;
  const eventDateFontSize = layoutMode === 'cards-2col' ? 17 : 19;
  const eventPaddingY = layoutMode === 'cards-2col' ? 14 : 12;

  return {
    layoutMode,
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
