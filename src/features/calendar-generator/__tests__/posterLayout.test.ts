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

  it('cambia automáticamente a grilla de tarjetas en 2 columnas con 7 o más acontecimientos', () => {
    const listLayout = computePosterLayoutMetrics(9, 5, 6);
    const cardsLayout = computePosterLayoutMetrics(9, 5, 7);

    expect(listLayout.layoutMode).toBe('list');
    expect(cardsLayout.layoutMode).toBe('cards-2col');
  });

  it('compacta celdas cuadradas en meses de 6 filas y alta densidad', () => {
    const normal = computePosterLayoutMetrics(9, 5, 4);
    const dense = computePosterLayoutMetrics(9, 6, 11);

    expect(dense.cellSize).toBeLessThan(normal.cellSize);
    expect(dense.calendarBlockHeight).toBeGreaterThan(300);
  });
});
