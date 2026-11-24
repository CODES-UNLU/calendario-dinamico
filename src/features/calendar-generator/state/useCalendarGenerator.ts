import { useCallback, useMemo, useState } from 'react';
import { SAMPLE_CALENDAR_CONFIG, SAMPLE_CALENDAR_EVENTS } from '../data/sampleCalendar';
import { generateCalendarGrid } from '../domain/calendarGrid';
import { filterEventsForMonth, sortEvents, type EventFormInput } from '../domain/events';
import type { CalendarConfig, CalendarEvent } from '../domain/types';

function createEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `ev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useCalendarGenerator(initialConfig?: CalendarConfig) {
  const now = new Date();
  const [config, setConfig] = useState<CalendarConfig>(
    initialConfig ?? {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    }
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [isSampleData, setIsSampleData] = useState(false);

  const monthEvents = useMemo(
    () => filterEventsForMonth(events, config.year, config.month),
    [events, config.year, config.month]
  );

  const grid = useMemo(
    () => generateCalendarGrid(config.year, config.month, monthEvents),
    [config.year, config.month, monthEvents]
  );

  const editingEvent = useMemo(
    () => events.find((ev) => ev.id === editingEventId) ?? null,
    [events, editingEventId]
  );

  const setMonthYear = useCallback((year: number, month: number) => {
    setConfig({ year, month });
    setEditingEventId(null);
  }, []);

  const addEvent = useCallback((input: EventFormInput) => {
    const newEvent: CalendarEvent = {
      id: createEventId(),
      title: input.title.trim(),
      date: input.date,
      color: input.color,
    };
    setEvents((prev) => sortEvents([...prev, newEvent]));
    setIsSampleData(false);
  }, []);

  const updateEvent = useCallback((id: string, input: EventFormInput) => {
    setEvents((prev) =>
      sortEvents(
        prev.map((ev) =>
          ev.id === id
            ? {
                ...ev,
                title: input.title.trim(),
                date: input.date,
                color: input.color,
              }
            : ev
        )
      )
    );
    setEditingEventId(null);
    setIsSampleData(false);
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
    setEditingEventId((curr) => (curr === id ? null : curr));
  }, []);

  const loadSampleData = useCallback(() => {
    setConfig(SAMPLE_CALENDAR_CONFIG);
    setEvents(SAMPLE_CALENDAR_EVENTS);
    setEditingEventId(null);
    setIsSampleData(true);
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
    setEditingEventId(null);
    setIsSampleData(false);
  }, []);

  return {
    config,
    grid,
    monthEvents,
    allEvents: events,
    editingEvent,
    isSampleData,
    setMonthYear,
    addEvent,
    updateEvent,
    deleteEvent,
    startEditing: setEditingEventId,
    cancelEditing: () => setEditingEventId(null),
    loadSampleData,
    clearEvents,
  };
}
