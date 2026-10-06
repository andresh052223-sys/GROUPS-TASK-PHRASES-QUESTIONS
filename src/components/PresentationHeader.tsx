import React from 'react';
import {
  Maximize,
  Minimize,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  Type,
  Sun,
  Moon,
  Trophy,
  BookOpen,
} from 'lucide-react';
import { Question, TextSize, DisplayTheme } from '../types';
import { sounds } from '../utils/audio';

interface PresentationHeaderProps {
  question: Question;
  totalQuestions: number;
  isPresentationMode: boolean;
  onTogglePresentationMode: () => void;
  onOpenTeacherMode: () => void;
  onOpenSetup: () => void;
  textSize: TextSize;
  onChangeTextSize: (size: TextSize) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: DisplayTheme;
  onChangeTheme: (theme: DisplayTheme) => void;
}

export const PresentationHeader: React.FC<PresentationHeaderProps> = ({
  question,
  totalQuestions,
  isPresentationMode,
  onTogglePresentationMode,
  onOpenTeacherMode,
  onOpenSetup,
  textSize,
  onChangeTextSize,
  soundEnabled,
  onToggleSound,
  theme,
  onChangeTheme,
}) => {
  const progressPercent = ((question.id) / totalQuestions) * 100;

  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md relative z-30 transition-all select-none">
      {/* Subtle Progress Bar across the very top */}
      <div className="w-full h-1 bg-slate-900 relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Left: Category and Question number */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-blue-400 drop-shadow-sm font-sans">
              {question.categoryName}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm sm:text-base font-black tracking-tight text-white tabular-nums">
              QUESTION {question.id} / {totalQuestions}
            </span>
            <span className="text-[11px] text-slate-400 hidden md:inline font-medium">
              — {question.categoryTitle}
            </span>
          </div>
        </div>

        {/* Right: Controls & Modes (Discreet in presentation mode) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Controls visible only outside pure presentation mode or collapsed discretely */}
          {!isPresentationMode && (
            <>
              {/* Teacher Mode Button */}
              <button
                onClick={onOpenTeacherMode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80 text-xs font-semibold tracking-wide transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                title="Abrir Panel del Instructor (Tecla T)"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">TEACHER MODE</span>
              </button>

              {/* Team Setup Button */}
              <button
                onClick={onOpenSetup}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80 text-xs font-semibold tracking-wide transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                title="Configuración de Grupos (Team Setup)"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">GRUPOS</span>
              </button>

              {/* Text Size Cycler */}
              <button
                onClick={() => {
                  const nextSize: TextSize =
                    textSize === 'normal'
                      ? 'large'
                      : textSize === 'large'
                      ? 'extra-large'
                      : 'normal';
                  onChangeTextSize(nextSize);
                }}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
                title={`Tamaño de texto: ${textSize}. Clic para cambiar`}
              >
                <span className="hidden sm:inline font-bold mr-1">T:</span>
                <span className="uppercase text-[11px] font-bold">
                  {textSize === 'extra-large' ? 'XL' : textSize === 'large' ? 'L' : 'M'}
                </span>
              </button>

              {/* Sound Toggle */}
              <button
                onClick={() => {
                  sounds.enabled = !soundEnabled;
                  onToggleSound();
                }}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors cursor-pointer"
                title={soundEnabled ? 'Silenciar efectos' : 'Activar efectos de sonido'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>

              {/* Theme Toggle (Dark vs High Contrast Projector) */}
              <button
                onClick={() => {
                  const nextTheme: DisplayTheme =
                    theme === 'dark-slate'
                      ? 'high-contrast-dark'
                      : theme === 'high-contrast-dark'
                      ? 'bright-projector'
                      : 'dark-slate';
                  onChangeTheme(nextTheme);
                }}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors cursor-pointer"
                title={`Tema actual: ${theme}`}
              >
                {theme === 'bright-projector' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-blue-400" />
                )}
              </button>
            </>
          )}

          {/* Presentation Mode Toggle Button */}
          <button
            onClick={onTogglePresentationMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold text-xs tracking-wider transition-all cursor-pointer shadow-md ${
              isPresentationMode
                ? 'bg-rose-600/80 hover:bg-rose-500 text-white border border-rose-500/50'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-blue-400/30'
            }`}
            title="Pantalla Completa / Modo Presentación (Tecla F)"
          >
            {isPresentationMode ? (
              <>
                <Minimize className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">SALIR</span>
              </>
            ) : (
              <>
                <Maximize className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PRESENTATION MODE</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
