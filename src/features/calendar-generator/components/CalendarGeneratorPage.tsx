import { FlaskConical, Trash2 } from 'lucide-react';
import { CODES_LOGOS } from '../../../shared/brand';
import { useCalendarGenerator } from '../state/useCalendarGenerator';
import { CalendarConfigForm } from './CalendarConfigForm';
import { CalendarPreview } from './CalendarPreview';
import { EventForm } from './EventForm';
import { EventList } from './EventList';

export function CalendarGeneratorPage() {
  const {
    config,
    grid,
    monthEvents,
    editingEvent,
    isSampleData,
    setMonthYear,
    addEvent,
    updateEvent,
    deleteEvent,
    startEditing,
    cancelEditing,
    loadSampleData,
    clearEvents,
  } = useCalendarGenerator();

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      <header className="border-b border-[#2d2d2d] bg-[#1a1a1a]/90 backdrop-blur px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={CODES_LOGOS.oscuro} alt="Logo CODES" className="h-9 w-auto" />
            <div>
              <h1 className="text-base sm:text-lg font-semibold leading-tight text-white">
                CODES Studio — Generador de Calendarios
              </h1>
              <p className="text-xs text-[#b0b0b0]">
                Centro Organizado de Estudiantes de Sistemas · UNLu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadSampleData}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#39c0c3]/50 bg-[#39c0c3]/10 px-3 py-1.5 text-xs font-medium text-[#5dd5d8] hover:bg-[#39c0c3]/20 transition-colors cursor-pointer"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              Cargar ejemplo
            </button>
            {monthEvents.length > 0 && (
              <button
                type="button"
                onClick={clearEvents}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#404040] px-3 py-1.5 text-xs font-medium text-[#b0b0b0] hover:bg-[#2d2d2d] hover:text-white transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Limpiar
              </button>
            )}
          </div>
        </div>
      </header>

      {isSampleData && (
        <div
          role="status"
          className="bg-[#ffd43b]/10 border-b border-[#ffd43b]/30 px-4 py-2 text-center text-xs text-[#ffd43b]"
        >
          Modo ejemplo activo: estás viendo datos de prueba (Noviembre 2026). Modificalos o limpiá
          la lista para crear tu publicación real.
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-4">
          <CalendarConfigForm config={config} onChange={setMonthYear} />
          <EventForm
            year={config.year}
            month={config.month}
            editingEvent={editingEvent}
            onSubmit={(input) => {
              if (editingEvent) {
                updateEvent(editingEvent.id, input);
              } else {
                addEvent(input);
              }
            }}
            onCancelEdit={cancelEditing}
          />
          <EventList
            events={monthEvents}
            editingEventId={editingEvent?.id ?? null}
            onEdit={startEditing}
            onDelete={deleteEvent}
          />
        </div>

        <div className="lg:col-span-7 lg:sticky lg:top-6">
          <CalendarPreview grid={grid} events={monthEvents} />
        </div>
      </main>
    </div>
  );
}
