# CODES Studio — Generador de Calendarios

Herramienta web estática del **Centro Organizado de Estudiantes de Sistemas (CODES — UNLu)** para generar publicaciones gráficas mensuales en formato `1080 × 1350 px` listas para redes sociales.

## Funcionalidades

- Selección de mes y año con grilla automática (lunes a domingo, años bisiestos, meses de 4, 5 o 6 filas).
- Carga, edición y eliminación de acontecimientos por número de día con colores de la escala de contribuciones de GitHub (`#0e4429`, `#006d32`, `#26a641`, `#39d353`) o color personalizado.
- Cambio automático entre listado vertical (1 a 6 acontecimientos) y tarjetas en 2 columnas (7 o más), extendiéndose verticalmente si hiciera falta.
- Exportación directa a PNG (`1080 × 1350 px` o mayor alto si se extiende) con nombre automático `codes-calendario-<mes>-<año>.png`.
- Persistencia automática por mes en `localStorage` y exportación/importación de borradores `.json`.

## Stack tecnológico

- **React + TypeScript + Vite**
- **Tailwind CSS v4**
- **Tipografías locales (`@fontsource`):** Handjet (mes vertical), Poppins (eventos y fechas), Consolas / Inconsolata (números de grilla)
- **Exportación PNG:** `html-to-image`
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

## Despliegue en GitHub Pages

El repositorio incluye el workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) que ejecuta `lint`, `typecheck`, `test`, `build` y publica `dist/` en GitHub Pages al hacer `push` a `main`.

1. En GitHub, ir a **Settings → Pages → Build and deployment → Source** y elegir **GitHub Actions**.
2. Hacer `git push -u origin main`.
3. La aplicación quedará disponible en `https://codes-unlu.github.io/calendario-dinamico/`.
