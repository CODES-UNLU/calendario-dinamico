import { useEffect, useState, type FormEvent } from 'react';
import { formatDateISO, getDaysInMonth, getMonthName } from '../domain/calendarGrid';
import { DEFAULT_EVENT_COLOR, EVENT_COLOR_PRESETS } from '../domain/colors';
import {
  validateEventInput,
  type EventFormInput,
  type EventValidationErrors,
} from '../domain/events';
import type { CalendarEvent } from '../domain/types';

interface EventFormProps {
  year: number;
  month: number;
  editingEvent: CalendarEvent | null;
  onSubmit: (input: EventFormInput) => void;
  onCancelEdit: () => void;
}

function extractDayFromISO(dateStr: string): string {
  const parts = dateStr.split('-');
  return parts.length === 3 ? String(Number(parts[2])) : '1';
}

export function EventForm({
  year,
  month,
  editingEvent,
  onSubmit,
  onCancelEdit,
}: EventFormProps) {
  const maxDays = getDaysInMonth(year, month);
  const monthLabel = getMonthName(month).toLowerCase();

  const [title, setTitle] = useState('');
  const [dayInput, setDayInput] = useState('1');
  const [color, setColor] = useState(DEFAULT_EVENT_COLOR);
  const [errors, setErrors] = useState<EventValidationErrors>({});

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDayInput(extractDayFromISO(editingEvent.date));
      setColor(editingEvent.color);
      setErrors({});
    } else {
      setTitle('');
      setDayInput('1');
      setColor(DEFAULT_EVENT_COLOR);
      setErrors({});
    }
  }, [editingEvent, year, month]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsedDay = Number(dayInput);

    if (!Number.isInteger(parsedDay) || parsedDay < 1 || parsedDay > maxDays) {
      setErrors({
        title: !title.trim() ? 'El título es obligatorio.' : undefined,
        date: `Ingresá un día válido entre 1 y ${maxDays} para ${monthLabel}.`,
      });
      return;
    }

    const input: EventFormInput = {
      title,
      date: formatDateISO(year, month, parsedDay),
      color,
    };

    const validation = validateEventInput(input, year, month);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    onSubmit(input);
    if (!editingEvent) {
      setTitle('');
    }
    setErrors({});
  };

  return (
    <section
      aria-label={editingEvent ? 'Editar acontecimiento' : 'Agregar acontecimiento'}
      className="rounded-xl border border-[#404040] bg-[#1a1a1a] p-4"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[#5dd5d8] mb-3">
        {editingEvent ? '2. Editar acontecimiento' : '2. Agregar acontecimiento'}
      </h2>

      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <div>
          <label htmlFor="event-title" className="block text-xs text-[#b0b0b0] mb-1">
            Título *
          </label>
          <input
            id="event-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Paro nodocente"
            className="w-full rounded-lg border border-[#404040] bg-[#2d2d2d] px-3 py-2 text-sm text-white placeholder-[#6c757d] focus:border-[#39c0c3] focus:outline-none"
          />
          {errors.title && (
            <p role="alert" className="mt-1 text-xs text-[#ff6b6b]">
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="event-day" className="block text-xs text-[#b0b0b0] mb-1">
            Día * <span className="text-[#6c757d]">(1–{maxDays} de {monthLabel})</span>
          </label>
          <input
            id="event-day"
            type="number"
            min={1}
            max={maxDays}
            step={1}
            value={dayInput}
            onChange={(e) => setDayInput(e.target.value)}
            className="w-full rounded-lg border border-[#404040] bg-[#2d2d2d] px-3 py-2 text-sm text-white focus:border-[#39c0c3] focus:outline-none"
          />
          {errors.date && (
            <p role="alert" className="mt-1 text-xs text-[#ff6b6b]">
              {errors.date}
            </p>
          )}
        </div>

        <div>
          <span className="block text-xs text-[#b0b0b0] mb-1.5">Color en grilla</span>
          <div className="flex flex-wrap items-center gap-2">
            {EVENT_COLOR_PRESETS.map((preset) => {
              const isSelected = color.toLowerCase() === preset.hex.toLowerCase();
              return (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => setColor(preset.hex)}
                  aria-label={preset.label}
                  title={preset.label}
                  style={{ backgroundColor: preset.hex }}
                  className={`h-7 w-7 rounded-md cursor-pointer transition-transform ${
                    isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1a1a1a] scale-105' : 'opacity-85 hover:opacity-100'
                  }`}
                />
              );
            })}
            <label className="inline-flex items-center gap-1.5 ml-auto text-xs text-[#b0b0b0] cursor-pointer">
              <span>Otro:</span>
              <input
                aria-label="Color personalizado"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-7 w-9 cursor-pointer rounded border border-[#404040] bg-transparent"
              />
            </label>
          </div>
          {errors.color && (
            <p role="alert" className="mt-1 text-xs text-[#ff6b6b]">
              {errors.color}
            </p>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-[#39c0c3] px-4 py-2 text-sm font-semibold text-[#0f0f0f] hover:bg-[#5dd5d8] transition-colors cursor-pointer"
          >
            {editingEvent ? 'Guardar cambios' : 'Agregar acontecimiento'}
          </button>
          {editingEvent && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-lg border border-[#404040] px-3 py-2 text-sm text-[#e0e0e0] hover:bg-[#2d2d2d] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
