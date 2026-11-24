import { describe, expect, it } from 'vitest';
import { computePosterLayoutMetrics } from '../template/posterLayout';

describe('posterLayout', () => {
  it('mantiene el tamaño del mes acotado para nombres largos como Septiembre', () => {
    const sept = computePosterLayoutMetrics('Septiembre'.length, 5, 5);
    const mayo = computePosterLayoutMetrics('Mayo'.length, 5, 5);

    expect(sept.monthFontSize).toBeLessThan(mayo.monthFontSize);
    expect(sept.monthFontSize).toBeGreaterThanOrEqual(84);
    expect(mayo.monthFontSize).toBeLessThanOrEqual(132);
  });

  it('compacta celdas cuadradas y textos en meses de 6 filas o alta densidad', () => {
    const normal = computePosterLayoutMetrics(9, 5, 4);
    const dense = computePosterLayoutMetrics(9, 6, 11);

    expect(dense.cellSize).toBeLessThan(normal.cellSize);
    expect(dense.eventTitleFontSize).toBeLessThan(normal.eventTitleFontSize);
    expect(dense.eventTitleFontSize).toBeGreaterThanOrEqual(20);
    expect(dense.eventDateFontSize).toBeGreaterThanOrEqual(16);
    expect(dense.calendarBlockHeight).toBeGreaterThan(300);
  });
});
