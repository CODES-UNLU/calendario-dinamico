import { useEffect, useRef } from 'react';
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
import { getEventColor } from '../domain/categories';
import type { CalendarEvent, CalendarGrid } from '../domain/types';
import { computePosterLayoutMetrics } from './posterLayout';

interface CalendarPosterProps {
  grid: CalendarGrid;
  events: CalendarEvent[];
  onOverflowChange?: (isOverflowing: boolean) => void;
}

export function CalendarPoster({ grid, events, onOverflowChange }: CalendarPosterProps) {
  const listContainerRef = useRef<HTMLDivElement>(null);
  const metrics = computePosterLayoutMetrics(
    grid.monthName.length,
    grid.weeks.length,
    events.length
  );

  useEffect(() => {
    const el = listContainerRef.current;
    if (!el || !onOverflowChange) return;
    const isOverflowing = el.scrollHeight > el.clientHeight + 2;
    onOverflowChange(isOverflowing);
  }, [events, grid.weeks.length, metrics.eventPaddingY, onOverflowChange]);

  return (
    <div
      data-testid="calendar-poster"
      style={{
        width: `${POSTER_DIMENSIONS.width}px`,
        height: `${POSTER_DIMENSIONS.height}px`,
        background: `
          radial-gradient(circle at 18% 22%, rgba(93, 213, 216, 0.34) 0%, transparent 48%),
          radial-gradient(circle at 86% 78%, rgba(57, 192, 195, 0.28) 0%, transparent 52%),
          linear-gradient(145deg, ${CODES_TEAL_SCALE[900]} 0%, ${CODES_TEAL_SCALE[700]} 42%, ${CODES_TEAL_SCALE[950]} 100%)
        `,
        fontFamily: POSTER_TYPOGRAPHY.body,
      }}
      className="relative flex flex-col items-center justify-between px-[82px] pt-[70px] pb-[42px] select-none overflow-hidden"
    >
      {/* Contenedor central oscuro */}
      <div
        style={{
          backgroundColor: CODES_SURFACES.posterCard,
          boxShadow: '0 28px 65px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
        className="w-full flex-1 min-h-0 rounded-[40px] px-[56px] pt-[48px] pb-[40px] flex flex-col overflow-hidden"
      >
        {/* Cabecera: Mes vertical + Grilla de calendario */}
        <div className="flex items-stretch gap-[34px] shrink-0">
          <div className="flex items-center justify-center shrink-0 pt-[30px]">
            <span
              style={{
                fontFamily: POSTER_TYPOGRAPHY.monthDisplay,
                fontSize: `${metrics.monthFontSize}px`,
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                letterSpacing: '0.05em',
                lineHeight: 0.85,
              }}
              className="font-bold uppercase text-white"
            >
              {grid.monthName}
            </span>
          </div>

          <div className="flex-1">
            {/* Encabezados de días L M M J V S D */}
            <div
              style={{ gap: `${metrics.gridGap}px` }}
              className="grid grid-cols-7 mb-[10px]"
            >
              {WEEKDAY_LABELS.map((label, idx) => (
                <div
                  key={`${label}-${idx}`}
                  style={{ fontSize: `${metrics.weekdayFontSize}px` }}
                  className="text-center font-medium text-white/95"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Semanas */}
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
                          style={{ height: `${metrics.cellHeight}px` }}
                        />
                      );
                    }

                    const primaryEvent = cell.events[0];
                    const bgColor = primaryEvent
                      ? getEventColor(primaryEvent.category, primaryEvent.customColor)
                      : CODES_SURFACES.posterCell;

                    return (
                      <div
                        key={cell.dateStr}
                        style={{
                          height: `${metrics.cellHeight}px`,
                          backgroundColor: bgColor,
                          fontFamily: POSTER_TYPOGRAPHY.calendarNumbers,
                          fontSize: `${metrics.cellFontSize}px`,
                        }}
                        className="rounded-[12px] flex items-center justify-center font-normal text-white relative"
                      >
                        <span>{cell.day}</span>
                        {cell.events.length > 1 && (
                          <span
                            className="absolute bottom-[5px] right-[7px] h-[7px] w-[7px] rounded-full bg-white/90"
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

        {/* Listado cronológico de acontecimientos */}
        <div
          ref={listContainerRef}
          className="mt-[28px] flex-1 min-h-0 flex flex-col justify-start overflow-hidden"
        >
          {events.length === 0 ? (
            <p className="text-[24px] text-[#6c757d] text-center my-auto">
              Sin acontecimientos cargados para {grid.monthName.toLowerCase()} {grid.year}.
            </p>
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
