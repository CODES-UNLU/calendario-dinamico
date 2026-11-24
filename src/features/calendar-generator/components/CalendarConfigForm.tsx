import { MONTH_NAMES } from '../domain/calendarGrid';
import type { CalendarConfig } from '../domain/types';

interface CalendarConfigFormProps {
  config: CalendarConfig;
  onChange: (year: number, month: number) => void;
}

export function CalendarConfigForm({ config, onChange }: CalendarConfigFormProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 2 + i);

  return (
    <section
      aria-label="Configuración del calendario"
      className="rounded-xl border border-[#404040] bg-[#1a1a1a] p-4"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[#5dd5d8] mb-3">
        1. Mes y año
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="calendar-month" className="block text-xs text-[#b0b0b0] mb-1">
            Mes
          </label>
          <select
            id="calendar-month"
            value={config.month}
            onChange={(e) => onChange(config.year, Number(e.target.value))}
            className="w-full rounded-lg border border-[#404040] bg-[#2d2d2d] px-3 py-2 text-sm text-white focus:border-[#39c0c3] focus:outline-none"
          >
            {MONTH_NAMES.map((name, index) => (
              <option key={name} value={index + 1}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="calendar-year" className="block text-xs text-[#b0b0b0] mb-1">
            Año
          </label>
          <select
            id="calendar-year"
            value={config.year}
            onChange={(e) => onChange(Number(e.target.value), config.month)}
            className="w-full rounded-lg border border-[#404040] bg-[#2d2d2d] px-3 py-2 text-sm text-white focus:border-[#39c0c3] focus:outline-none"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
