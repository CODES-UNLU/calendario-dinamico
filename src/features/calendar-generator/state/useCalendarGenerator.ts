import { useCallback, useMemo, useState } from 'react';
import {
  buildCalendarJsonFilename,
  downloadTextFile,
  loadActiveConfig,
  loadMonthEvents,
  parseCalendarJson,
  saveActiveConfig,
  saveMonthEvents,
  serializeCalendarJson,
} from '../../../shared/storage/calendarStorage';
import { SAMPLE_CALENDAR_CONFIG, SAMPLE_CALENDAR_EVENTS } from '../data/sampleCalendar';
import { generateCalendarGrid, getMonthName } from '../domain/calendarGrid';
import { filterEventsForMonth, sortEvents, type EventFormInput } from '../domain/events';
import type { CalendarConfig, CalendarEvent } from '../domain/types';

function createEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `ev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getInitialState(initialConfig?: CalendarConfig) {
  const now = new Date();
  const savedConfig = initialConfig ?? loadActiveConfig();
  const config = savedConfig ?? {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
  const events = loadMonthEvents(config.year, config.month);
  return { config, events };
}

export function useCalendarGenerator(initialConfig?: CalendarConfig) {
  const initial = useMemo(() => getInitialState(initialConfig), [initialConfig]);
  const [config, setConfig] = useState<CalendarConfig>(initial.config);
  const [events, setEvents] = useState<CalendarEvent[]>(initial.events);
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
    const nextConfig = { year, month };
    setConfig(nextConfig);
    saveActiveConfig(nextConfig);
    setEvents(loadMonthEvents(year, month));
    setEditingEventId(null);
    setIsSampleData(false);
  }, []);

  const addEvent = useCallback(
    (input: EventFormInput) => {
      const newEvent: CalendarEvent = {
        id: createEventId(),
        title: input.title.trim(),
        date: input.date,
        color: input.color,
      };
      setEvents((prev) => {
        const next = sortEvents([...prev, newEvent]);
        saveMonthEvents(config.year, config.month, next);
        return next;
      });
      setIsSampleData(false);
    },
    [config.year, config.month]
  );

  const updateEvent = useCallback(
    (id: string, input: EventFormInput) => {
      setEvents((prev) => {
        const next = sortEvents(
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
        );
        saveMonthEvents(config.year, config.month, next);
        return next;
      });
      setEditingEventId(null);
      setIsSampleData(false);
    },
    [config.year, config.month]
  );

  const deleteEvent = useCallback(
    (id: string) => {
      setEvents((prev) => {
        const next = prev.filter((ev) => ev.id !== id);
        saveMonthEvents(config.year, config.month, next);
        return next;
      });
      setEditingEventId((curr) => (curr === id ? null : curr));
    },
    [config.year, config.month]
  );

  const loadSampleData = useCallback(() => {
    setConfig(SAMPLE_CALENDAR_CONFIG);
    setEvents(SAMPLE_CALENDAR_EVENTS);
    setEditingEventId(null);
    setIsSampleData(true);
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
    saveMonthEvents(config.year, config.month, []);
    setEditingEventId(null);
    setIsSampleData(false);
  }, [config.year, config.month]);

  const exportJson = useCallback(() => {
    const content = serializeCalendarJson(config, monthEvents);
    const filename = buildCalendarJsonFilename(getMonthName(config.month), config.year);
    downloadTextFile(filename, content);
  }, [config, monthEvents]);

  const importJson = useCallback((rawText: string) => {
    const doc = parseCalendarJson(rawText);
    setConfig(doc.config);
    saveActiveConfig(doc.config);
    setEvents(doc.events);
    saveMonthEvents(doc.config.year, doc.config.month, doc.events);
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
    exportJson,
    importJson,
  };
}
