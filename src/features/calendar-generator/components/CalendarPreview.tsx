import { Download, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { POSTER_DIMENSIONS } from '../../../shared/brand';
import { buildCalendarFilename, exportElementToPng } from '../../../shared/export/exportPng';
import type { CalendarEvent, CalendarGrid } from '../domain/types';
import { CalendarPoster } from '../template/CalendarPoster';

interface CalendarPreviewProps {
  grid: CalendarGrid;
  events: CalendarEvent[];
}

export function CalendarPreview({ grid, events }: CalendarPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previewPosterWrapperRef = useRef<HTMLDivElement>(null);
  const exportNodeRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);
  const [posterHeight, setPosterHeight] = useState<number>(POSTER_DIMENSIONS.height);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

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

  useEffect(() => {
    const wrapper = previewPosterWrapperRef.current;
    if (!wrapper) return;
    const nextHeight = Math.max(POSTER_DIMENSIONS.height, wrapper.scrollHeight);
    setPosterHeight(nextHeight);
  }, [events, grid]);

  const handleExport = async () => {
    if (!exportNodeRef.current || isExporting) return;
    setIsExporting(true);
    setExportError(null);

    try {
      const exportHeight = Math.max(POSTER_DIMENSIONS.height, exportNodeRef.current.scrollHeight);
      const filename = buildCalendarFilename(grid.monthName, grid.year);
      await exportElementToPng(exportNodeRef.current, filename, {
        width: POSTER_DIMENSIONS.width,
        height: exportHeight,
      });
    } catch (err) {
      console.error('Error al exportar PNG:', err);
      setExportError(
        'No se pudo generar la imagen PNG. Intentá nuevamente o verificá que no haya bloqueos de navegador.'
      );
    } finally {
      setIsExporting(false);
    }
  };

  const scaledWidth = Math.round(POSTER_DIMENSIONS.width * scale);
  const scaledHeight = Math.round(posterHeight * scale);

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center">
      <div className="flex flex-wrap items-center justify-between gap-2 w-full max-w-[626px] mb-3">
        <div className="text-xs text-[#b0b0b0]">
          <span className="font-medium text-white">Vista previa en tiempo real</span>
          <span className="ml-2 text-[#6c757d]">
            {POSTER_DIMENSIONS.width} × {posterHeight} px
          </span>
        </div>

        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="inline-flex items-center gap-2 rounded-lg bg-[#39c0c3] px-4 py-2 text-xs sm:text-sm font-semibold text-[#0f0f0f] hover:bg-[#5dd5d8] disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Exportando...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Descargar PNG
            </>
          )}
        </button>
      </div>

      {exportError && (
        <div
          role="alert"
          className="w-full max-w-[626px] mb-3 rounded-xl border border-[#dc3545]/50 bg-[#dc3545]/10 px-3.5 py-2.5 text-xs text-[#ff6b6b]"
        >
          {exportError}
        </div>
      )}

      <div
        style={{ width: `${scaledWidth}px`, height: `${scaledHeight}px` }}
        className="relative overflow-hidden rounded-2xl border border-[#404040] shadow-2xl bg-[#022324]"
      >
        <div
          ref={previewPosterWrapperRef}
          style={{
            width: `${POSTER_DIMENSIONS.width}px`,
            minHeight: `${POSTER_DIMENSIONS.height}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <CalendarPoster grid={grid} events={events} />
        </div>
      </div>

      {/* Lienzo oculto a escala real sin transformaciones CSS para exportación fiel */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-99999px',
          top: 0,
          width: `${POSTER_DIMENSIONS.width}px`,
          minHeight: `${POSTER_DIMENSIONS.height}px`,
          pointerEvents: 'none',
        }}
      >
        <div ref={exportNodeRef}>
          <CalendarPoster grid={grid} events={events} />
        </div>
      </div>
    </div>
  );
}
