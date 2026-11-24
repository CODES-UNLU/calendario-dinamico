import { AlertTriangle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { POSTER_DIMENSIONS } from '../../../shared/brand';
import type { CalendarEvent, CalendarGrid } from '../domain/types';
import { CalendarPoster } from '../template/CalendarPoster';

interface CalendarPreviewProps {
  grid: CalendarGrid;
  events: CalendarEvent[];
}

export function CalendarPreview({ grid, events }: CalendarPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const availableWidth = el.clientWidth;
      if (availableWidth > 0) {
        const nextScale = Math.min(availableWidth / POSTER_DIMENSIONS.width, 0.58);
        setScale(nextScale);
      }
    };

    updateScale();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateScale);
      observer.observe(el);
      return () => observer.disconnect();
    }
  }, []);

  const scaledWidth = Math.round(POSTER_DIMENSIONS.width * scale);
  const scaledHeight = Math.round(POSTER_DIMENSIONS.height * scale);

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center">
      <div className="flex items-center justify-between w-full max-w-[626px] mb-2 text-xs text-[#b0b0b0]">
        <span>Vista previa en tiempo real</span>
        <span>
          {POSTER_DIMENSIONS.width} × {POSTER_DIMENSIONS.height} px (4:5)
        </span>
      </div>

      {isOverflowing && (
        <div
          role="alert"
          className="w-full max-w-[626px] mb-3 rounded-xl border border-[#ffd43b]/40 bg-[#ffd43b]/10 px-3.5 py-2.5 text-xs text-[#ffd43b] flex items-start gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            El contenido excede el alto disponible de una sola publicación. Reducí la cantidad de
            acontecimientos o acortá los títulos para evitar recortes al exportar.
          </span>
        </div>
      )}

      <div
        style={{ width: `${scaledWidth}px`, height: `${scaledHeight}px` }}
        className="relative overflow-hidden rounded-2xl border border-[#404040] shadow-2xl bg-[#022324]"
      >
        <div
          style={{
            width: `${POSTER_DIMENSIONS.width}px`,
            height: `${POSTER_DIMENSIONS.height}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <CalendarPoster
            grid={grid}
            events={events}
            onOverflowChange={setIsOverflowing}
          />
        </div>
      </div>
    </div>
  );
}
