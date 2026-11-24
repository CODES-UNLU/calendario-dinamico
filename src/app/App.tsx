import { CODES_LOGOS } from '../shared/brand';

export function App() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-2xl border border-[#404040] bg-[#1a1a1a] p-8 text-center shadow-xl">
        <img
          src={CODES_LOGOS.oscuro}
          alt="Logo CODES"
          className="w-16 h-16 mx-auto mb-4"
        />
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          CODES Studio — Generador de Calendarios
        </h1>
        <p className="mt-2 text-sm text-[#b0b0b0]">
          Proyecto inicializado (Etapa 0). Listo para comenzar con la Etapa 1 — Prototipo funcional.
        </p>
      </div>
    </div>
  );
}
