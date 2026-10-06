import React from 'react';
import { ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface PresentationFooterProps {
  currentIndex: number;
  totalQuestions: number;
  isRevealed: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToggleReveal: () => void;
  isPresentationMode: boolean;
}

export const PresentationFooter: React.FC<PresentationFooterProps> = ({
  currentIndex,
  totalQuestions,
  isRevealed,
  onPrevious,
  onNext,
  onToggleReveal,
  isPresentationMode,
}) => {
  const canGoPrevious = currentIndex > 0;
  const isLastQuestion = currentIndex >= totalQuestions - 1;

  return (
    <footer
      className={`w-full py-3 sm:py-4 px-4 sm:px-8 border-t border-slate-800/80 bg-slate-950/70 backdrop-blur-md select-none transition-all ${
        isPresentationMode ? 'opacity-80 hover:opacity-100' : 'opacity-100'
      }`}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Previous Button */}
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer ${
            canGoPrevious
              ? 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95'
              : 'bg-slate-900/40 text-slate-600 border border-slate-800/60 cursor-not-allowed'
          }`}
          title="Pregunta anterior (Flecha Izquierda ←)"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">ANTERIOR</span>
          <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-slate-400 border border-slate-700">
            ←
          </kbd>
        </button>

        {/* Center: Reveal / Hide Toggle Button */}
        <button
          onClick={onToggleReveal}
          className={`flex items-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black tracking-wider uppercase transition-all shadow-lg active:scale-95 cursor-pointer border ${
            isRevealed
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600/60'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-blue-400/30 shadow-blue-600/25'
          }`}
          title="Mostrar u ocultar respuesta (Barra Espaciadora)"
        >
          {isRevealed ? (
            <>
              <EyeOff className="w-4 h-4 text-slate-400" />
              <span>OCULTAR RESPUESTA</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 text-blue-200" />
              <span>REVEAL ANSWER</span>
            </>
          )}
          <kbd className="hidden lg:inline px-1.5 py-0.5 rounded bg-black/30 text-[10px] text-slate-300 border border-white/20 normal-case font-mono ml-1">
            Espacio
          </kbd>
        </button>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/30 text-xs sm:text-sm font-bold tracking-wide transition-all active:scale-95 cursor-pointer shadow-lg shadow-emerald-600/20"
          title="Siguiente pregunta (Flecha Derecha →)"
        >
          <span className="hidden sm:inline">
            {isLastQuestion ? 'FINALIZAR' : 'SIGUIENTE'}
          </span>
          <span className="sm:hidden">{isLastQuestion ? 'FIN' : 'SIG'}</span>
          <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-emerald-200 border border-emerald-700/60">
            →
          </kbd>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
};
