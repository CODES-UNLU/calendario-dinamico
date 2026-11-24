import { toPng } from 'html-to-image';
import { POSTER_DIMENSIONS } from '../brand';

export function buildCalendarFilename(monthName: string, year: number): string {
  const normalizedMonth = monthName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return `codes-calendario-${normalizedMonth}-${year}.png`;
}

export interface ExportPngOptions {
  width?: number;
  height?: number;
}

export async function exportElementToPng(
  element: HTMLElement,
  filename: string,
  options: ExportPngOptions = {}
): Promise<void> {
  const width = options.width ?? POSTER_DIMENSIONS.width;
  const height = options.height ?? POSTER_DIMENSIONS.height;

  if (typeof document !== 'undefined' && 'fonts' in document) {
    await document.fonts.ready;
  }

  const dataUrl = await toPng(element, {
    width,
    height,
    canvasWidth: width,
    canvasHeight: height,
    pixelRatio: 1,
    cacheBust: true,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
