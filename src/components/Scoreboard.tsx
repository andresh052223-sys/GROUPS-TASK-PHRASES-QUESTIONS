import React from 'react';
import { Trophy, Plus, Minus, RotateCcw, Users, X, ChevronUp, ChevronDown } from 'lucide-react';
import { Team } from '../types';
import { sounds } from '../utils/audio';

interface ScoreboardProps {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  isOpen: boolean;
  onToggle: () => void;
  compact?: boolean;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  teams,
  setTeams,
  isOpen,
  onToggle,
  compact = false,
}) => {
  const activeTeams = teams.filter((t) => t.active);

  const addPoints = (teamId: number, delta: number) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, score: Math.max(0, t.score + delta) } : t))
    );
    sounds.playPoint(delta > 0);
  };

  const resetTeam = (teamId: number) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, score: 0 } : t))
    );
  };

  const toggleTeamActive = (teamId: number) => {
    const currentActiveCount = teams.filter((t) => t.active).length;
    // Don't disable if only 2 left
    if (teams.find((t) => t.id === teamId)?.active && currentActiveCount <= 2) {
      return;
    }
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, active: !t.active } : t))
    );
  };

  const handleNameChange = (teamId: number, newName: string) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, name: newName } : t))
    );
  };

  // Sort by score to get leader
  const sorted = [...activeTeams].sort((a, b) => b.score - a.score);
  const highestScore = sorted[0]?.score || 0;

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 group text-sm font-semibold tracking-wide cursor-pointer"
        title="Ver Marcador de Equipos (Tecla P)"
      >
        <Trophy className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">Puntuación</span>
        <div className="flex items-center -space-x-1.5 ml-1">
          {activeTeams.slice(0, 4).map((t) => (
            <span
              key={t.id}
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-slate-900 shadow ${t.color}`}
            >
              {t.score}
            </span>
          ))}
        </div>
      </button>
    );
  }

  return (
    <div
      className={`fixed ${
        compact ? 'top-16 right-4 w-96' : 'bottom-4 right-4 sm:right-6 w-[94vw] sm:w-[540px]'
      } z-40 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl p-4 sm:p-5 transition-all animate-in fade-in slide-in-from-bottom-4 duration-200 text-slate-100`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wider uppercase text-slate-200">
              Marcador de Equipos
            </h3>
            <p className="text-[11px] text-slate-400">
              Control de puntos del concurso en vivo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Active teams selector */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
            <Users className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <span className="text-[11px] font-medium text-slate-400 mr-1">Equipos:</span>
            {[2, 3, 4, 5, 6].map((num) => {
              const isActive = activeTeams.length === num;
              return (
                <button
                  key={num}
                  onClick={() => {
                    setTeams((prev) =>
                      prev.map((t, idx) => ({ ...t, active: idx < num }))
                    );
                  }}
                  className={`w-6 h-6 rounded text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          <button
            onClick={onToggle}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Cerrar panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
        {activeTeams.map((team) => {
          const isLeader = team.score > 0 && team.score === highestScore;
          return (
            <div
              key={team.id}
              className={`p-3 rounded-xl border transition-all ${
                isLeader
                  ? 'bg-amber-950/20 border-amber-500/40 shadow-sm shadow-amber-500/10'
                  : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600/80'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className={`w-3 h-3 rounded-full flex-shrink-0 ${team.color}`} />
                  <input
                    type="text"
                    value={team.name}
                    onChange={(e) => handleNameChange(team.id, e.target.value)}
                    className="font-bold text-sm bg-transparent border-b border-transparent hover:border-slate-600 focus:border-blue-500 focus:outline-none text-slate-200 w-full truncate"
                  />
                  {isLeader && (
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 flex-shrink-0">
                      Líder
                    </span>
                  )}
                </div>

                <div className="text-2xl font-black text-white tabular-nums tracking-tight px-1">
                  {team.score}
                </div>
              </div>

              {/* Action Buttons: +1, +2, +3, -1 */}
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  onClick={() => addPoints(team.id, 1)}
                  className="flex-1 py-1 px-1.5 bg-blue-600/80 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-transform active:scale-95 cursor-pointer shadow-sm"
                >
                  +1
                </button>
                <button
                  onClick={() => addPoints(team.id, 2)}
                  className="flex-1 py-1 px-1.5 bg-indigo-600/80 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-transform active:scale-95 cursor-pointer shadow-sm"
                >
                  +2
                </button>
                <button
                  onClick={() => addPoints(team.id, 3)}
                  className="flex-1 py-1 px-1.5 bg-emerald-600/80 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-transform active:scale-95 cursor-pointer shadow-sm"
                >
                  +3
                </button>
                <button
                  onClick={() => addPoints(team.id, -1)}
                  className="py-1 px-2 bg-rose-600/30 hover:bg-rose-600/60 text-rose-300 rounded-lg text-xs font-bold transition-transform active:scale-95 cursor-pointer"
                  title="Restar 1 punto"
                >
                  -1
                </button>
                <button
                  onClick={() => resetTeam(team.id)}
                  className="py-1 px-1.5 text-slate-500 hover:text-slate-300 rounded-lg text-xs transition-colors cursor-pointer"
                  title="Reiniciar puntos del equipo"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span>Presiona <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">P</kbd> para mostrar/ocultar</span>
        <button
          onClick={() => {
            setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
            sounds.playPoint(false);
          }}
          className="text-slate-400 hover:text-rose-400 transition-colors text-[11px] flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Reiniciar todos los puntos
        </button>
      </div>
    </div>
  );
};
