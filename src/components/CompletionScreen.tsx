import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, Sparkles, RotateCcw, ArrowLeft } from 'lucide-react';
import { Team } from '../types';
import { sounds } from '../utils/audio';

interface CompletionScreenProps {
  teams: Team[];
  onRestart: () => void;
  onReview: () => void;
  totalQuestions?: number;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  teams,
  onRestart,
  onReview,
  totalQuestions = 168,
}) => {
  useEffect(() => {
    sounds.playFanfare();

    // Trigger celebration confetti
    const duration = 4.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const activeTeams = teams
    .filter((t) => t.active)
    .sort((a, b) => b.score - a.score);

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center p-6 sm:p-10 animate-in fade-in duration-500">
      {/* Trophy Badge */}
      <div className="relative mb-6">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-2xl shadow-amber-500/30 rotate-3 transform hover:rotate-0 transition-transform">
          <Trophy className="w-14 h-14 sm:w-16 sm:h-16 text-slate-950" />
        </div>
        <div className="absolute -top-2 -right-2 p-2 bg-blue-600 rounded-full text-white shadow-lg animate-bounce">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>

      {/* Main Titles */}
      <div className="space-y-3 mb-8">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
          ACCOUNTING ENGLISH CHALLENGE
        </span>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase drop-shadow-sm">
          {totalQuestions} QUESTIONS COMPLETED!
        </h1>
        <p className="text-2xl sm:text-3xl font-light text-emerald-400 tracking-wide font-serif italic">
          Congratulations! ¡Excelente trabajo aprendices!
        </p>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Han completado todas las etapas de vocabulario, sustantivos, adjetivos, verbos y estructuras contables en inglés.
        </p>
      </div>

      {/* Team Leaderboard / Podium */}
      {activeTeams.length > 0 && (
        <div className="w-full max-w-2xl bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl mb-10 shadow-2xl">
          <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-5 flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Marcador Final del Concurso
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {activeTeams.map((team, index) => {
              const isWinner = index === 0 && team.score > 0;
              return (
                <div
                  key={team.id}
                  className={`relative p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    isWinner
                      ? 'bg-gradient-to-b from-amber-500/20 to-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-500/10'
                      : index === 1
                      ? 'bg-slate-800/80 border-slate-600/70'
                      : index === 2
                      ? 'bg-slate-800/60 border-slate-700/60'
                      : 'bg-slate-800/40 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`w-3 h-3 rounded-full ${team.color}`}
                    />
                    <span className="font-bold text-sm text-slate-200">
                      {team.name}
                    </span>
                  </div>

                  <div className="text-4xl font-black text-white tabular-nums my-1">
                    {team.score}
                    <span className="text-xs font-normal text-slate-400 ml-1">pts</span>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full mt-1 uppercase tracking-wider ${
                      isWinner
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : index === 1
                        ? 'bg-slate-700 text-slate-300'
                        : index === 2
                        ? 'bg-amber-900/60 text-amber-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isWinner
                      ? '1º Lugar (Campeón)'
                      : `${index + 1}º Lugar`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={onReview}
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Revisar Pregunta 100
        </button>

        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xl shadow-blue-600/30"
        >
          <RotateCcw className="w-4 h-4" />
          Reiniciar Concurso desde la Pregunta 1
        </button>
      </div>
    </div>
  );
};
