import React from 'react';
import { BookOpen, Sparkles, ArrowRight, Trophy, Users, Layers, Play } from 'lucide-react';
import { ModuleInfo, Team } from '../types';
import { MODULES } from '../data/modules';

interface ModuleSelectionScreenProps {
  onSelectModule: (moduleId: string) => void;
  moduleProgress: Record<string, number>;
  teams: Team[];
  onOpenTeamSetup: () => void;
}

export const ModuleSelectionScreen: React.FC<ModuleSelectionScreenProps> = ({
  onSelectModule,
  moduleProgress,
  teams,
  onOpenTeamSetup,
}) => {
  const activeTeams = teams.filter((t) => t.active);
  const totalPoints = activeTeams.reduce((acc, t) => acc + t.score, 0);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-8 md:p-12 bg-slate-950 text-slate-100 select-none overflow-y-auto">
      {/* Top Bar with Contest & Team Overview */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-black tracking-widest uppercase text-slate-400">
              Interactive Educational Platform
            </span>
            <span className="text-sm font-bold text-white block">
              SENA English Challenge
            </span>
          </div>
        </div>

        {/* Groups Summary Pill */}
        <button
          onClick={onOpenTeamSetup}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Configurar o ver equipos"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>{activeTeams.length} Grupos</span>
          {totalPoints > 0 && (
            <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[11px] font-black">
              {totalPoints} pts
            </span>
          )}
          <Users className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
        </button>
      </header>

      {/* Main Hero & Module Cards */}
      <main className="w-full max-w-5xl mx-auto my-auto py-8 sm:py-12 flex flex-col items-center text-center">
        {/* Badges and Titles */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 font-extrabold text-xs sm:text-sm tracking-[0.25em] uppercase mb-4 shadow-sm animate-in fade-in">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>ENGLISH CLASSROOM PRESENTATION</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase drop-shadow-md mb-2">
          ENGLISH CLASSROOM
        </h1>

        <p className="text-xl sm:text-2xl font-bold text-slate-300 tracking-wide mb-10 sm:mb-14">
          SELECT A MODULE
        </p>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full">
          {MODULES.map((mod) => {
            const currentProgress = (moduleProgress[mod.id] || 0) + 1;
            const isModule1 = mod.id === 'module-1';

            return (
              <div
                key={mod.id}
                onClick={() => onSelectModule(mod.id)}
                className={`group relative text-left p-6 sm:p-8 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between hover:scale-[1.02] active:scale-[0.99] shadow-2xl ${
                  isModule1
                    ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950/40 border-blue-500/40 hover:border-blue-400 hover:shadow-blue-500/20'
                    : 'bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/40 border-emerald-500/40 hover:border-emerald-400 hover:shadow-emerald-500/20'
                }`}
              >
                {/* Glow Backdrop on hover */}
                <div
                  className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-tr ${mod.accentGradient}`}
                />

                <div>
                  {/* Top Header inside card */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border shadow-sm ${
                        isModule1
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      <span>MODULE {mod.moduleNumber}</span>
                    </span>

                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-800 text-white border border-slate-700 shadow-sm">
                      {mod.badge}
                    </span>
                  </div>

                  {/* Main Title */}
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight group-hover:text-blue-200 transition-colors mb-2">
                    {mod.title}
                  </h2>

                  {/* Subtitle / Focus */}
                  <div
                    className={`inline-block text-xs font-extrabold uppercase tracking-wider mb-4 ${
                      isModule1 ? 'text-blue-400' : 'text-emerald-400'
                    }`}
                  >
                    {isModule1 ? 'Accounting English' : 'Basic English'}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-medium">
                    {mod.description}
                  </p>
                </div>

                {/* Footer with Progress & Play CTA */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-400 font-semibold">
                    <span>Progreso: </span>
                    <span className="text-white font-bold">
                      Slide {currentProgress} / {mod.slideCount}
                    </span>
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-lg transition-transform group-hover:scale-105 bg-gradient-to-r ${mod.accentGradient}`}
                  >
                    <span>{currentProgress > 1 ? 'CONTINUE' : 'START'}</span>
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer Instructions */}
      <footer className="w-full max-w-5xl mx-auto py-3 text-center text-xs text-slate-500 font-medium border-t border-slate-800/60">
        <span>
          Presiona cualquier módulo para proyectar. La tabla de clasificación y puntuación de los grupos se mantiene automáticamente en ambos módulos.
        </span>
      </footer>
    </div>
  );
};
