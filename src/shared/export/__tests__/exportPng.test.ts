import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildCalendarFilename, exportElementToPng } from '../exportPng';

const { toPngMock } = vi.hoisted(() => ({
  toPngMock: vi.fn(),
}));

vi.mock('html-to-image', () => ({
  toPng: toPngMock,
}));

describe('exportPng', () => {
  beforeEach(() => {
    toPngMock.mockReset();
  });

  it('genera el nombre de archivo normalizado sin tildes y en minúsculas', () => {
    expect(buildCalendarFilename('Noviembre', 2026)).toBe('codes-calendario-noviembre-2026.png');
    expect(buildCalendarFilename('Sábado', 2026)).toBe('codes-calendario-sabado-2026.png');
  });

  it('exporta a 1080x1350 con pixelRatio 1 y dispara la descarga', async () => {
    toPngMock.mockResolvedValue('data:image/png;base64,AAAA');
    const el = document.createElement('div');
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    await exportElementToPng(el, 'codes-calendario-noviembre-2026.png');

    expect(toPngMock).toHaveBeenCalledWith(
      el,
      expect.objectContaining({
        width: 1080,
        height: 1350,
        canvasWidth: 1080,
        canvasHeight: 1350,
        pixelRatio: 1,
      })
    );
    expect(clickSpy).toHaveBeenCalledTimes(1);
    clickSpy.mockRestore();
  });

  it('propaga errores si falla la generación de imagen', async () => {
    toPngMock.mockRejectedValue(new Error('Canvas error'));
    const el = document.createElement('div');

    await expect(
      exportElementToPng(el, 'codes-calendario-noviembre-2026.png')
    ).rejects.toThrow('Canvas error');
  });
});
