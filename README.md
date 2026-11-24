# CODES Studio — Generador de Calendarios

Herramienta web estática del **Centro Organizado de Estudiantes de Sistemas (CODES — UNLu)** para generar publicaciones gráficas mensuales en formato `1080 × 1350 px` (4:5) listas para redes sociales.

## Stack tecnológico

- **React + TypeScript + Vite**
- **Tailwind CSS v4**
- **Tipografías locales (`@fontsource`):** Handjet (mes vertical), Poppins (eventos y fechas), Consolas / Inconsolata (números de grilla)
- **Vitest + React Testing Library**
- **ESLint + Prettier**

## Identidad visual

Los colores y logotipos SVG oficiales provienen de [`codes-unlu/Identidad-CODES`](https://github.com/codes-unlu/Identidad-CODES) y están centralizados en `src/shared/brand/`.

## Requisitos e instalación

- Node.js 20+ y npm

```bash
npm install
npm run dev
```

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Verifica tipos (`tsc -b`) y genera el build de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run format` | Formatea el código con Prettier |
| `npm run typecheck` | Verifica tipos TypeScript sin emitir archivos |
| `npm test` | Ejecuta los tests con Vitest |
