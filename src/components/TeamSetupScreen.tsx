import React from 'react';
import { Users, Plus, Minus, Play, Trophy, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { Team } from '../types';

interface TeamSetupScreenProps {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  onStart: () => void;
}

const DEFAULT_COLORS = [
  'bg-blue-500 text-blue-400 border-blue-500/40',
  'bg-emerald-500 text-emerald-400 border-emerald-500/40',
  'bg-amber-500 text-amber-400 border-amber-500/40',
  'bg-purple-500 text-purple-400 border-purple-500/40',
  'bg-rose-500 text-rose-400 border-rose-500/40',
  'bg-cyan-500 text-cyan-400 border-cyan-500/40',
];

export const TeamSetupScreen: React.FC<TeamSetupScreenProps> = ({
  teams,
  setTeams,
  onStart,
}) => {
  const activeCount = teams.filter((t) => t.active).length;

  const handleSetCount = (count: number) => {
    setTeams((prev) =>
      prev.map((team, index) => ({
        ...team,
        active: index < count,
      }))
    );
  };

  const handleNameChange = (id: number, val: string) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            customSubtitle: val,
            name: val.trim() ? `GROUP ${t.number} — ${val.trim()}` : `GROUP ${t.number}`,
          };
        }
        return t;
      })
    );
  };

  const addGroup = () => {
    if (activeCount < 6) {
      handleSetCount(activeCount + 1);
    }
  };

  const removeGroup = () => {
    if (activeCount > 2) {
      handleSetCount(activeCount - 1);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-950 text-slate-100 select-none">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center animate-in fade-in duration-300">
        {/* Badge & Title */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 font-extrabold text-xs sm:text-sm tracking-[0.25em] uppercase mb-4 shadow-sm">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>CLASSROOM CONTEST CONFIGURATION</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase drop-shadow-md mb-3">
          TEAM SETUP
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-xl mb-8">
          Organiza a los aprendices en grupos para el concurso. Elige cuántos grupos participarán (de 2 a 6) y personaliza sus nombres si lo deseas.
        </p>

        {/* Group Count Controls */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-8 w-full max-w-2xl shadow-xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Cantidad de Grupos</h3>
                <p className="text-xs text-slate-400">Selecciona entre 2 y 6 grupos activos</p>
              </div>
            </div>

            {/* Quick buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={removeGroup}
                disabled={activeCount <= 2}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 border border-slate-700 transition-all cursor-pointer"
                title="Eliminar un grupo"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {[2, 3, 4, 5, 6].map((num) => {
                  const isSelected = activeCount === num;
                  return (
                    <button
                      key={num}
                      onClick={() => handleSetCount(num)}
                      className={`w-9 h-9 rounded-lg font-black text-sm transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={addGroup}
                disabled={activeCount >= 6}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 border border-slate-700 transition-all cursor-pointer"
                title="Agregar un grupo"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Groups Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl mb-10 text-left">
          {teams.slice(0, activeCount).map((team, idx) => (
            <div
              key={team.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs text-white shadow ${team.color}`}
                  >
                    {team.number}
                  </span>
                  <div>
                    <span className="font-black text-base text-white tracking-wide">
                      GROUP {team.number}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Atajo de teclado: Tecla <kbd className="font-mono font-bold text-blue-400">{team.number}</kbd>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Puntos
                  </span>
                  <span className="text-xl font-black text-emerald-400 tabular-nums">
                    {team.score} PTS
                  </span>
                </div>
              </div>

              {/* Optional Custom Name Input */}
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Nombre personalizado opcional:
                </label>
                <input
                  type="text"
                  placeholder="Ej. THE ACCOUNTANTS, THE AUDITORS..."
                  value={team.customSubtitle || ''}
                  onChange={(e) => handleNameChange(team.id, e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="group relative inline-flex items-center gap-3.5 px-10 sm:px-14 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-lg sm:text-2xl tracking-wider uppercase shadow-2xl shadow-blue-600/40 hover:shadow-blue-500/60 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer border border-blue-400/40"
        >
          <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white group-hover:scale-110 transition-transform" />
          <span>START CHALLENGE</span>
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="mt-4 text-xs text-slate-500 font-medium">
          Durante el concurso, la tabla de clasificación permanecerá fija en el costado derecho con atajos de teclado automáticos.
        </p>
      </div>
    </div>
  );
};
