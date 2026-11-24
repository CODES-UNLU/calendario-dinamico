import {
  CODES_BORDERS,
  CODES_LOGOS,
  CODES_SURFACES,
  CODES_TEAL_SCALE,
  CODES_TEXT,
  POSTER_DIMENSIONS,
  POSTER_TYPOGRAPHY,
} from '../../../shared/brand';
import { formatEventDate, WEEKDAY_LABELS } from '../domain/calendarGrid';
import type { CalendarEvent, CalendarGrid } from '../domain/types';
import { computePosterLayoutMetrics } from './posterLayout';

interface CalendarPosterProps {
  grid: CalendarGrid;
  events: CalendarEvent[];
}

export function CalendarPoster({ grid, events }: CalendarPosterProps) {
  const metrics = computePosterLayoutMetrics(
    grid.monthName.length,
    grid.weeks.length,
    events.length
  );

  const gridWidth = 7 * metrics.cellSize + 6 * metrics.gridGap;

  return (
    <div
      data-testid="calendar-poster"
      style={{
        width: `${POSTER_DIMENSIONS.width}px`,
        minHeight: `${POSTER_DIMENSIONS.height}px`,
        background: `
          radial-gradient(circle at 18% 22%, rgba(93, 213, 216, 0.34) 0%, transparent 48%),
          radial-gradient(circle at 86% 78%, rgba(57, 192, 195, 0.28) 0%, transparent 52%),
          linear-gradient(145deg, ${CODES_TEAL_SCALE[900]} 0%, ${CODES_TEAL_SCALE[700]} 42%, ${CODES_TEAL_SCALE[950]} 100%)
        `,
        fontFamily: POSTER_TYPOGRAPHY.body,
      }}
      className="relative flex flex-col items-center justify-between px-[82px] pt-[70px] pb-[42px] select-none"
    >
      {/* Contenedor central oscuro */}
      <div
        style={{
          backgroundColor: CODES_SURFACES.posterCard,
          boxShadow: '0 28px 65px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
        className="w-full flex-1 rounded-[40px] px-[56px] pt-[48px] pb-[44px] flex flex-col"
      >
        {/* Cabecera centrada: Mes vertical (misma altura que todo el calendario) + Grilla cuadrada */}
        <div className="flex items-start justify-center gap-[32px] shrink-0">
          <svg
            width="104"
            height={metrics.calendarBlockHeight}
            viewBox={`0 0 104 ${metrics.calendarBlockHeight}`}
            aria-hidden="true"
            className="shrink-0 overflow-visible"
          >
            <text
              x={-metrics.calendarBlockHeight / 2}
              y={54}
              transform="rotate(-90)"
              textAnchor="middle"
              dominantBaseline="central"
              textLength={metrics.calendarBlockHeight}
              lengthAdjust="spacing"
              fill="#ffffff"
              style={{
                fontFamily: POSTER_TYPOGRAPHY.monthDisplay,
                fontSize: `${metrics.monthFontSize}px`,
                fontWeight: 700,
              }}
            >
              {grid.monthName.toUpperCase()}
            </text>
          </svg>
          <span className="sr-only">{grid.monthName}</span>

          <div style={{ width: `${gridWidth}px` }} className="shrink-0">
            {/* Encabezados de días L M M J V S D */}
            <div
              style={{ gap: `${metrics.gridGap}px`, height: `${metrics.weekdayHeight}px` }}
              className="grid grid-cols-7 items-center mb-[10px]"
            >
              {WEEKDAY_LABELS.map((label, idx) => (
                <div
                  key={`${label}-${idx}`}
                  style={{ fontSize: `${metrics.weekdayFontSize}px` }}
                  className="text-center font-medium text-white/95 leading-none"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Semanas con casillas cuadradas */}
            <div style={{ gap: `${metrics.gridGap}px` }} className="flex flex-col">
              {grid.weeks.map((week, wIdx) => (
                <div
                  key={wIdx}
                  style={{ gap: `${metrics.gridGap}px` }}
                  className="grid grid-cols-7"
                >
                  {week.map((cell, cIdx) => {
                    if (cell.day === null) {
                      return (
                        <div
                          key={`empty-${wIdx}-${cIdx}`}
                          style={{
                            width: `${metrics.cellSize}px`,
                            height: `${metrics.cellSize}px`,
                          }}
                        />
                      );
                    }

                    const primaryEvent = cell.events[0];
                    const bgColor = primaryEvent ? primaryEvent.color : CODES_SURFACES.posterCell;

                    return (
                      <div
                        key={cell.dateStr}
                        style={{
                          width: `${metrics.cellSize}px`,
                          height: `${metrics.cellSize}px`,
                          backgroundColor: bgColor,
                          fontFamily: POSTER_TYPOGRAPHY.calendarNumbers,
                          fontSize: `${metrics.cellFontSize}px`,
                        }}
                        className="rounded-[12px] flex items-center justify-center font-normal text-white relative"
                      >
                        <span>{cell.day}</span>
                        {cell.events.length > 1 && (
                          <span
                            className="absolute bottom-[5px] right-[6px] h-[6px] w-[6px] rounded-full bg-white/90"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Listado cronológico: 1 columna clásica o grilla de tarjetas en 2 columnas automáticamente */}
        <div className="mt-[32px] flex-1 flex flex-col justify-start">
          {events.length === 0 ? (
            <p className="text-[24px] text-[#6c757d] text-center my-auto">
              Sin acontecimientos cargados para {grid.monthName.toLowerCase()} {grid.year}.
            </p>
          ) : metrics.layoutMode === 'cards-2col' ? (
            <div className="grid grid-cols-2 gap-[14px]">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    paddingTop: `${metrics.eventPaddingY}px`,
                    paddingBottom: `${metrics.eventPaddingY}px`,
                    border: `1px solid ${CODES_BORDERS.posterDivider}`,
                  }}
                  className="rounded-[16px] px-[20px] flex flex-col justify-center"
                >
                  <p
                    style={{
                      color: CODES_TEXT.posterEventTitle,
                      fontSize: `${metrics.eventTitleFontSize}px`,
                    }}
                    className="font-semibold leading-snug break-words"
                  >
                    {ev.title}
                  </p>
                  <p
                    style={{
                      color: CODES_TEXT.posterEventDate,
                      fontSize: `${metrics.eventDateFontSize}px`,
                    }}
                    className="font-normal mt-[3px]"
                  >
                    {formatEventDate(ev.date)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col">
              {events.map((ev, index) => (
                <div
                  key={ev.id}
                  style={{
                    paddingTop: `${metrics.eventPaddingY}px`,
                    paddingBottom: `${metrics.eventPaddingY}px`,
                    borderBottom:
                      index < events.length - 1
                        ? `1px solid ${CODES_BORDERS.posterDivider}`
                        : 'none',
                  }}
                >
                  <p
                    style={{
                      color: CODES_TEXT.posterEventTitle,
                      fontSize: `${metrics.eventTitleFontSize}px`,
                    }}
                    className="font-semibold leading-snug break-words"
                  >
                    {ev.title}
                  </p>
                  <p
                    style={{
                      color: CODES_TEXT.posterEventDate,
                      fontSize: `${metrics.eventDateFontSize}px`,
                    }}
                    className="font-normal mt-[2px]"
                  >
                    {formatEventDate(ev.date)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Logotipo institucional inferior */}
      <div className="pt-[22px] shrink-0 flex items-center justify-center">
        <img src={CODES_LOGOS.oscuro} alt="CODES UNLu" className="h-[72px] w-auto" />
      </div>
    </div>
  );
}
