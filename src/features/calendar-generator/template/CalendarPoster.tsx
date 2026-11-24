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

interface CalendarPosterProps {
  grid: CalendarGrid;
  events: CalendarEvent[];
}

export function CalendarPoster({ grid, events }: CalendarPosterProps) {
  return (
    <div
      data-testid="calendar-poster"
      style={{
        width: `${POSTER_DIMENSIONS.width}px`,
        height: `${POSTER_DIMENSIONS.height}px`,
        background: `radial-gradient(circle at 20% 25%, ${CODES_TEAL_SCALE[600]} 0%, ${CODES_TEAL_SCALE[800]} 45%, ${CODES_TEAL_SCALE[950]} 100%)`,
        fontFamily: POSTER_TYPOGRAPHY.body,
      }}
      className="relative flex flex-col items-center justify-between px-[84px] pt-[74px] pb-[44px] select-none overflow-hidden"
    >
      {/* Contenedor central oscuro */}
      <div
        style={{
          backgroundColor: CODES_SURFACES.posterCard,
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
        }}
        className="w-full flex-1 rounded-[38px] px-[56px] pt-[52px] pb-[44px] flex flex-col overflow-hidden"
      >
        {/* Cabecera: Mes vertical + Grilla de calendario */}
        <div className="flex items-start gap-[34px]">
          <div className="flex items-center justify-center shrink-0 pt-[12px]">
            <span
              style={{
                fontFamily: POSTER_TYPOGRAPHY.monthDisplay,
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                letterSpacing: '0.04em',
                lineHeight: 0.88,
              }}
              className="text-[116px] font-bold uppercase text-white"
            >
              {grid.monthName}
            </span>
          </div>

          <div className="flex-1">
            {/* Encabezados de días L M M J V S D */}
            <div className="grid grid-cols-7 gap-[12px] mb-[12px]">
              {WEEKDAY_LABELS.map((label, idx) => (
                <div
                  key={`${label}-${idx}`}
                  className="text-center text-[24px] font-medium text-white/90"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Semanas */}
            <div className="flex flex-col gap-[12px]">
              {grid.weeks.map((week, wIdx) => (
                <div key={wIdx} className="grid grid-cols-7 gap-[12px]">
                  {week.map((cell, cIdx) => {
                    if (cell.day === null) {
                      return <div key={`empty-${wIdx}-${cIdx}`} className="h-[68px]" />;
                    }

                    const primaryEvent = cell.events[0];
                    const bgColor = primaryEvent
                      ? getEventColor(primaryEvent.category, primaryEvent.customColor)
                      : CODES_SURFACES.posterCell;

                    return (
                      <div
                        key={cell.dateStr}
                        style={{
                          backgroundColor: bgColor,
                          fontFamily: POSTER_TYPOGRAPHY.calendarNumbers,
                        }}
                        className="h-[68px] rounded-[12px] flex items-center justify-center text-[32px] font-normal text-white relative"
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
        <div className="mt-[36px] flex-1 flex flex-col justify-start overflow-hidden">
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
                    borderBottom:
                      index < events.length - 1
                        ? `1px solid ${CODES_BORDERS.posterDivider}`
                        : 'none',
                  }}
                  className="py-[12px]"
                >
                  <p
                    style={{ color: CODES_TEXT.posterEventTitle }}
                    className="text-[24px] font-semibold leading-tight"
                  >
                    {ev.title}
                  </p>
                  <p
                    style={{ color: CODES_TEXT.posterEventDate }}
                    className="text-[20px] font-normal mt-[2px]"
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
      <div className="pt-[24px] flex items-center justify-center">
        <img src={CODES_LOGOS.oscuro} alt="CODES UNLu" className="h-[74px] w-auto" />
      </div>
    </div>
  );
}
