import { Pencil, Trash2 } from 'lucide-react';
import { formatEventDate } from '../domain/calendarGrid';
import { EVENT_CATEGORIES, getEventColor } from '../domain/categories';
import type { CalendarEvent } from '../domain/types';

interface EventListProps {
  events: CalendarEvent[];
  editingEventId: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function EventList({ events, editingEventId, onEdit, onDelete }: EventListProps) {
  return (
    <section
      aria-label="Acontecimientos cargados"
      className="rounded-xl border border-[#404040] bg-[#1a1a1a] p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#5dd5d8]">
          3. Acontecimientos ({events.length})
        </h2>
      </div>

      {events.length === 0 ? (
        <p className="text-xs text-[#6c757d] py-4 text-center">
          No hay acontecimientos cargados para este mes.
        </p>
      ) : (
        <ul className="divide-y divide-[#2d2d2d]">
          {events.map((ev) => {
            const color = getEventColor(ev.category, ev.customColor);
            const isEditing = ev.id === editingEventId;

            return (
              <li
                key={ev.id}
                className={`py-2.5 flex items-start justify-between gap-3 ${
                  isEditing ? 'bg-[#2d2d2d]/60 -mx-2 px-2 rounded-lg' : ''
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <span
                    className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white break-words">{ev.title}</p>
                    <p className="text-xs text-[#b0b0b0]">
                      {formatEventDate(ev.date)} · {EVENT_CATEGORIES[ev.category].label}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onEdit(ev.id)}
                    aria-label={`Editar ${ev.title}`}
                    className="rounded-md p-1.5 text-[#b0b0b0] hover:bg-[#2d2d2d] hover:text-white transition-colors cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(ev.id)}
                    aria-label={`Eliminar ${ev.title}`}
                    className="rounded-md p-1.5 text-[#b0b0b0] hover:bg-[#dc3545]/20 hover:text-[#ff6b6b] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
