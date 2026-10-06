import React from 'react';
import { Volume2, Eye, ArrowRight, Sparkles, BookOpen, Languages } from 'lucide-react';
import { Question, TextSize, DisplayTheme } from '../types';
import { speakEnglish } from '../utils/audio';

interface SlideViewProps {
  question: Question;
  isRevealed: boolean;
  onReveal: () => void;
  onNext: () => void;
  textSize: TextSize;
  theme?: DisplayTheme;
}

export const SlideView: React.FC<SlideViewProps> = ({
  question,
  isRevealed,
  onReveal,
  onNext,
  textSize,
  theme = 'dark-slate',
}) => {
  const isLight = theme === 'bright-projector';

  // Extra massive font scales for classroom projectors
  const getSpanishChallengeClass = () => {
    switch (textSize) {
      case 'extra-large':
        return 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[7.5rem] 2xl:text-[8.5rem] font-black tracking-tight leading-[1.08]';
      case 'large':
        return 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[7rem] font-extrabold tracking-tight leading-[1.1]';
      case 'normal':
      default:
        return 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.12]';
    }
  };

  const getEnglishRevealedClass = () => {
    switch (textSize) {
      case 'extra-large':
        return 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-[1.08]';
      case 'large':
        return 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[1.1]';
      case 'normal':
      default:
        return 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.12]';
    }
  };

  const getSpanishRevealedClass = () => {
    switch (textSize) {
      case 'extra-large':
        return 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.15]';
      case 'large':
        return 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight leading-[1.18]';
      case 'normal':
      default:
        return 'text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium tracking-tight leading-[1.2]';
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 py-4 max-w-7xl mx-auto">
      {!isRevealed ? (
        /* =========================================================================
           ESTADO 1 — RETO (CHALLENGE)
           ========================================================================= */
        <div
          key={`challenge-${question.id}`}
          className="w-full flex flex-col items-center justify-center text-center my-auto transition-all duration-300 animate-in fade-in zoom-in-95"
        >
          {/* CHALLENGE Badge */}
          <div
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-sm sm:text-base tracking-[0.25em] uppercase mb-8 sm:mb-12 shadow-sm ${
              isLight
                ? 'bg-amber-100 border-2 border-amber-300 text-amber-900'
                : 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
            }`}
          >
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <span>CHALLENGE</span>
          </div>

          {/* SPANISH PHRASE IN EXTREMELY LARGE FONT */}
          <div className="max-w-6xl mx-auto px-2">
            <h1
              className={`${getSpanishChallengeClass()} ${
                isLight ? 'text-slate-950' : 'text-white drop-shadow-md'
              } select-text transition-all`}
            >
              {question.spanish}
            </h1>
          </div>

          <p
            className={`mt-6 sm:mt-12 text-base sm:text-xl font-medium tracking-wide ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            Traduce al inglés con tu equipo
          </p>

          {/* BIG REVEAL ANSWER BUTTON */}
          <div className="mt-10 sm:mt-16">
            <button
              onClick={onReveal}
              className="group relative inline-flex items-center gap-4 px-10 sm:px-14 py-5 sm:py-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xl sm:text-3xl tracking-wider uppercase shadow-2xl shadow-blue-600/40 hover:shadow-blue-500/60 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer border border-blue-400/40"
            >
              <Eye className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
              <span>REVEAL ANSWER</span>
              <span className="hidden lg:inline text-xs font-semibold px-2.5 py-1 rounded bg-black/30 border border-white/20 text-blue-100 normal-case tracking-normal">
                Espacio
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* =========================================================================
           ESTADO 2 — RESPUESTA (INGLÉS Y ESPAÑOL JUNTOS EN LETRAS MUY GRANDES)
           ========================================================================= */
        <div
          key={`answer-${question.id}`}
          className="w-full flex flex-col items-center justify-center text-center my-auto transition-all duration-300 animate-in fade-in zoom-in-95 space-y-6 sm:space-y-8"
        >
          {/* DUAL DISPLAY CONTAINER: ENGLISH + ESPAÑOL */}
          <div className="w-full max-w-6xl mx-auto space-y-5 sm:space-y-6">
            {/* 1. ENGLISH PHRASE (PROMINENT & MASSIVE) */}
            <div
              className={`p-5 sm:p-7 rounded-3xl border transition-all ${
                isLight
                  ? 'bg-emerald-50/70 border-emerald-300 shadow-lg shadow-emerald-500/10'
                  : 'bg-emerald-950/20 border-emerald-500/40 shadow-xl shadow-emerald-500/5'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs sm:text-sm font-black tracking-widest uppercase ${
                    isLight
                      ? 'bg-emerald-200/90 text-emerald-900 border border-emerald-400'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  <Languages className="w-3.5 h-3.5" />
                  ENGLISH
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap">
                <h1
                  className={`${getEnglishRevealedClass()} ${
                    isLight
                      ? 'text-emerald-950 font-black'
                      : 'text-emerald-300 sm:text-white drop-shadow-md font-extrabold'
                  } select-text transition-all`}
                >
                  {question.english}
                </h1>

                {/* Text-to-speech pronunciation button */}
                <button
                  onClick={() => speakEnglish(question.english)}
                  className={`p-3.5 sm:p-4 rounded-full transition-all hover:scale-110 active:scale-95 shadow-lg cursor-pointer flex-shrink-0 ${
                    isLight
                      ? 'bg-emerald-200 hover:bg-emerald-300 text-emerald-900 border border-emerald-400'
                      : 'bg-slate-800 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-slate-700 hover:border-emerald-500'
                  }`}
                  title="Escuchar pronunciación nativa en inglés (Tecla S)"
                >
                  <Volume2 className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>
              </div>
            </div>

            {/* 2. SPANISH PHRASE (ALSO VERY LARGE AND PROMINENT AS REQUESTED) */}
            <div
              className={`p-4 sm:p-6 rounded-3xl border transition-all ${
                isLight
                  ? 'bg-amber-50/70 border-amber-300 shadow-md'
                  : 'bg-slate-900/80 border-slate-700/80 shadow-md'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1 px-3.5 py-0.5 rounded-full text-xs sm:text-sm font-extrabold tracking-widest uppercase ${
                    isLight
                      ? 'bg-amber-200/90 text-amber-900 border border-amber-400'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  ESPAÑOL
                </span>
              </div>

              <h2
                className={`${getSpanishRevealedClass()} ${
                  isLight ? 'text-slate-800' : 'text-slate-200'
                } select-text transition-all`}
              >
                {question.spanish}
              </h2>
            </div>
          </div>

          {/* 3. GRAMMAR & VOCABULARY CARD (Clean, ultra-readable, projector-optimized) */}
          <div
            className={`w-full max-w-4xl rounded-2xl p-5 sm:p-6 text-left shadow-2xl backdrop-blur-md border ${
              isLight
                ? 'bg-white border-slate-300 text-slate-800 shadow-slate-200'
                : 'bg-slate-900/90 border-slate-700/80 text-slate-100'
            }`}
          >
            {/* Grammar Section */}
            <div className="mb-4">
              <div
                className={`flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider mb-1.5 ${
                  isLight ? 'text-blue-700' : 'text-blue-400'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Grammar:</span>
              </div>
              <p
                className={`text-sm sm:text-base font-medium ${
                  isLight ? 'text-slate-800' : 'text-slate-200'
                }`}
              >
                {question.grammarExplanation}
              </p>
              {question.grammarStructure && (
                <div
                  className={`mt-2 inline-block px-3.5 py-1.5 rounded-lg font-mono text-xs sm:text-sm border ${
                    isLight
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-blue-950/60 border-blue-500/30 text-blue-300'
                  }`}
                >
                  <span className={isLight ? 'font-bold text-blue-800' : 'font-bold text-blue-400'}>
                    Structure:{' '}
                  </span>
                  {question.grammarStructure}
                </div>
              )}
            </div>

            {/* Short Answers for Yes/No questions if available */}
            {question.shortAnswers && question.shortAnswers.length > 0 && (
              <div
                className={`mb-4 pt-3 border-t ${
                  isLight ? 'border-slate-200' : 'border-slate-800'
                }`}
              >
                <span
                  className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${
                    isLight ? 'text-purple-700' : 'text-purple-400'
                  }`}
                >
                  Short Answers:
                </span>
                <div className="flex flex-wrap gap-2">
                  {question.shortAnswers.map((ans, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-md text-xs sm:text-sm font-semibold border ${
                        isLight
                          ? 'bg-purple-50 border-purple-200 text-purple-900'
                          : 'bg-purple-950/60 border-purple-500/30 text-purple-200'
                      }`}
                    >
                      {ans}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Vocabulary breakdown */}
            {question.vocabulary && question.vocabulary.length > 0 && (
              <div
                className={`pt-3 border-t ${
                  isLight ? 'border-slate-200' : 'border-slate-800'
                }`}
              >
                <span
                  className={`text-xs font-bold uppercase tracking-wider block mb-2 ${
                    isLight ? 'text-amber-700' : 'text-amber-400'
                  }`}
                >
                  Vocabulary:
                </span>
                <div className="flex flex-wrap gap-2">
                  {question.vocabulary.map((item, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm border ${
                        isLight
                          ? 'bg-slate-100 text-slate-800 border-slate-300'
                          : 'bg-slate-800 text-slate-200 border-slate-700/80'
                      }`}
                    >
                      <strong
                        className={
                          isLight
                            ? 'text-amber-800 font-semibold'
                            : 'text-amber-300 font-semibold'
                        }
                      >
                        {item.english}
                      </strong>
                      <span className="text-slate-400">=</span>
                      <span>{item.spanish}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Accounting Context Tip if available */}
            {question.accountingTip && (
              <div
                className={`mt-3 pt-3 border-t text-xs flex items-start gap-1.5 ${
                  isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
                }`}
              >
                <span
                  className={`font-bold uppercase text-[10px] tracking-wider mt-0.5 ${
                    isLight ? 'text-emerald-700' : 'text-emerald-400'
                  }`}
                >
                  Tip Contable:
                </span>
                <span>{question.accountingTip}</span>
              </div>
            )}
          </div>

          {/* 4. BIG NEXT BUTTON */}
          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={onNext}
              className="group relative inline-flex items-center gap-3.5 px-10 sm:px-14 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xl sm:text-2xl tracking-wider uppercase shadow-xl shadow-emerald-600/35 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer border border-emerald-400/30"
            >
              <span>NEXT</span>
              <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 group-hover:translate-x-1.5 transition-transform" />
              <span className="hidden lg:inline text-xs font-semibold px-2 py-0.5 rounded bg-black/30 border border-white/20 text-emerald-100 normal-case tracking-normal">
                →
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
