import { useEffect, useState, type FormEvent } from 'react';
import { formatDateISO, getDaysInMonth } from '../domain/calendarGrid';
import { EVENT_CATEGORIES, EVENT_CATEGORY_LIST } from '../domain/categories';
import {
  validateEventInput,
  type EventFormInput,
  type EventValidationErrors,
} from '../domain/events';
import type { CalendarEvent, EventCategory } from '../domain/types';

interface EventFormProps {
  year: number;
  month: number;
  editingEvent: CalendarEvent | null;
  onSubmit: (input: EventFormInput) => void;
  onCancelEdit: () => void;
}

export function EventForm({
  year,
  month,
  editingEvent,
  onSubmit,
  onCancelEdit,
}: EventFormProps) {
  const defaultDate = formatDateISO(year, month, 1);
  const maxDate = formatDateISO(year, month, getDaysInMonth(year, month));

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(defaultDate);
  const [category, setCategory] = useState<EventCategory>('paro-nodocente');
  const [useCustomColor, setUseCustomColor] = useState(false);
  const [customColor, setCustomColor] = useState(EVENT_CATEGORIES['paro-nodocente'].defaultColor);
  const [errors, setErrors] = useState<EventValidationErrors>({});

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDate(editingEvent.date);
      setCategory(editingEvent.category);
      setUseCustomColor(Boolean(editingEvent.customColor));
      setCustomColor(
        editingEvent.customColor ?? EVENT_CATEGORIES[editingEvent.category].defaultColor
      );
      setErrors({});
    } else {
      setTitle('');
      setDate(formatDateISO(year, month, 1));
      setUseCustomColor(false);
      setErrors({});
    }
  }, [editingEvent, year, month]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const input: EventFormInput = {
      title,
      date,
      category,
      customColor: useCustomColor ? customColor : undefined,
    };

    const validation = validateEventInput(input, year, month);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    onSubmit(input);
    if (!editingEvent) {
      setTitle('');
      setUseCustomColor(false);
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="event-date" className="block text-xs text-[#b0b0b0] mb-1">
              Fecha *
            </label>
            <input
              id="event-date"
              type="date"
              min={defaultDate}
              max={maxDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-[#404040] bg-[#2d2d2d] px-3 py-2 text-sm text-white focus:border-[#39c0c3] focus:outline-none"
            />
            {errors.date && (
              <p role="alert" className="mt-1 text-xs text-[#ff6b6b]">
                {errors.date}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="event-category" className="block text-xs text-[#b0b0b0] mb-1">
              Categoría
            </label>
            <select
              id="event-category"
              value={category}
              onChange={(e) => {
                const nextCat = e.target.value as EventCategory;
                setCategory(nextCat);
                if (!useCustomColor) {
                  setCustomColor(EVENT_CATEGORIES[nextCat].defaultColor);
                }
              }}
              className="w-full rounded-lg border border-[#404040] bg-[#2d2d2d] px-3 py-2 text-sm text-white focus:border-[#39c0c3] focus:outline-none"
            >
              {EVENT_CATEGORY_LIST.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="inline-flex items-center gap-2 text-xs text-[#b0b0b0] cursor-pointer">
            <input
              type="checkbox"
              checked={useCustomColor}
              onChange={(e) => setUseCustomColor(e.target.checked)}
              className="rounded border-[#404040] accent-[#39c0c3]"
            />
            Color personalizado en grilla
          </label>
          {useCustomColor && (
            <input
              aria-label="Color personalizado"
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="h-7 w-10 cursor-pointer rounded border border-[#404040] bg-transparent"
            />
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
