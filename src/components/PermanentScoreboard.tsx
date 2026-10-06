import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Plus,
  Minus,
  RotateCcw,
  Keyboard,
  Settings,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from 'lucide-react';
import { Team, PointAnimation } from '../types';

interface PermanentScoreboardProps {
  teams: Team[];
  onAddPoint: (teamId: number, delta: number) => void;
  onResetScores: () => void;
  onOpenSetup: () => void;
  animations: PointAnimation[];
  isLight?: boolean;
}

export const PermanentScoreboard: React.FC<PermanentScoreboardProps> = ({
  teams,
  onAddPoint,
  onResetScores,
  onOpenSetup,
  animations,
  isLight = false,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const prevRankingsRef = useRef<Record<number, number>>({});
  const [rankMovement, setRankMovement] = useState<Record<number, 'up' | 'down'>>({});

  const activeTeams = teams.filter((t) => t.active);

  // Sort teams descending by score. Stable secondary tie-break by team number.
  const sortedTeams = [...activeTeams].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.number - b.number;
  });

  // Track position shifts (who moved UP or DOWN)
  useEffect(() => {
    const currentRanks: Record<number, number> = {};
    const movements: Record<number, 'up' | 'down'> = {};

    sortedTeams.forEach((team, index) => {
      const prevRank = prevRankingsRef.current[team.id];
      currentRanks[team.id] = index + 1;

      if (prevRank !== undefined && prevRank !== index + 1) {
        if (index + 1 < prevRank) {
          movements[team.id] = 'up';
        } else if (index + 1 > prevRank) {
          movements[team.id] = 'down';
        }
      }
    });

    if (Object.keys(movements).length > 0) {
      setRankMovement(movements);
      const timer = setTimeout(() => {
        setRankMovement({});
      }, 1400);
      prevRankingsRef.current = currentRanks;
      return () => clearTimeout(timer);
    }

    prevRankingsRef.current = currentRanks;
  }, [teams]);

  // Calculate medals and ranks with shared tie display
  const getRankInfo = (index: number, currentScore: number) => {
    if (currentScore === 0) {
      return {
        badge: `${index + 1}`,
        isMedal: false,
        style: isLight
          ? 'bg-slate-200 text-slate-700 border-slate-300'
          : 'bg-slate-800 text-slate-400 border-slate-700',
        leader: false,
      };
    }

    let rank = 1;
    for (let i = 0; i < sortedTeams.length; i++) {
      if (sortedTeams[i].score > currentScore) {
        rank++;
      }
    }

    if (rank === 1) {
      return {
        badge: '🥇',
        isMedal: true,
        style: 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 border-amber-300 shadow-md shadow-amber-500/30 ring-2 ring-amber-400/50',
        leader: true,
      };
    }
    if (rank === 2) {
      return {
        badge: '🥈',
        isMedal: true,
        style: 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950 border-slate-300 shadow-md shadow-slate-400/20 ring-1 ring-slate-300/40',
        leader: false,
      };
    }
    if (rank === 3) {
      return {
        badge: '🥉',
        isMedal: true,
        style: 'bg-gradient-to-br from-amber-600 to-amber-800 text-white border-amber-500 shadow-md shadow-amber-700/20 ring-1 ring-amber-600/40',
        leader: false,
      };
    }
    return {
      badge: `${rank}`,
      isMedal: false,
      style: isLight
        ? 'bg-slate-200 text-slate-700 border-slate-300'
        : 'bg-slate-800 text-slate-400 border-slate-700',
      leader: false,
    };
  };

  return (
    <aside
      className={`w-full lg:w-[28vw] xl:w-[30vw] 2xl:w-[32vw] min-w-[340px] max-w-[500px] flex-shrink-0 flex flex-col border-l transition-all select-none h-screen ${
        isLight
          ? 'bg-slate-100 border-slate-300 text-slate-900 shadow-2xl'
          : 'bg-slate-950/95 border-slate-800/90 text-slate-100 shadow-2xl backdrop-blur-2xl'
      }`}
    >
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-inherit flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 shadow-sm border border-amber-500/30">
            <Trophy className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg lg:text-xl font-black tracking-wider uppercase flex items-center gap-2">
              <span>SCOREBOARD</span>
            </h2>
            <p className="text-xs text-slate-400 font-medium">Clasificación en Vivo</p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenSetup}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Configuración de Grupos (Team Setup)"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
            title="Reiniciar Puntuación (Reset Score)"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Keyboard Shortcut Banner */}
      <div className="px-4 py-2 bg-blue-950/50 border-b border-blue-900/40 text-xs text-blue-300 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-bold">
          <Keyboard className="w-4 h-4 text-blue-400" />
          <span>Atajos de teclado:</span>
        </div>
        <div className="font-mono text-xs space-x-1.5">
          <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-extrabold shadow-sm">
            1–{activeTeams.length}: +1 pto
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">
            Shift+1–{activeTeams.length}: -1
          </span>
        </div>
      </div>

      {/* Teams Ranking List with FLIP Layout Animation */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5">
        <AnimatePresence initial={false}>
          {sortedTeams.map((team, idx) => {
            const rankInfo = getRankInfo(idx, team.score);
            const activeAnimation = animations.find((a) => a.teamId === team.id);
            const movement = rankMovement[team.id];

            return (
              <motion.div
                layout
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  layout: {
                    type: 'spring',
                    damping: 24,
                    stiffness: 280,
                    mass: 0.8,
                  },
                }}
                className={`relative p-5 sm:p-6 rounded-3xl border transition-all duration-300 shadow-md flex flex-col justify-between ${
                  activeAnimation && activeAnimation.delta > 0
                    ? 'ring-4 ring-emerald-400/80 border-emerald-400 bg-emerald-950/30 scale-[1.03] shadow-2xl shadow-emerald-500/30'
                    : activeAnimation && activeAnimation.delta < 0
                    ? 'ring-4 ring-rose-400/80 border-rose-400 bg-rose-950/30 scale-[0.98] shadow-2xl shadow-rose-500/30'
                    : rankInfo.leader
                    ? isLight
                      ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                      : 'bg-gradient-to-br from-amber-950/30 via-slate-900/90 to-slate-900 border-amber-500/60 ring-1 ring-amber-500/30 shadow-xl'
                    : isLight
                    ? 'bg-white border-slate-300 hover:border-slate-400 shadow-sm'
                    : 'bg-slate-900/85 border-slate-800 hover:border-slate-700 shadow-sm'
                }`}
              >
                {/* Visual Position Movement Badge (⬆️ SUBIÓ / ⬇️ BAJÓ) */}
                {movement === 'up' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-3 left-6 z-20 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500 text-slate-950 flex items-center gap-1 shadow-lg shadow-emerald-500/30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>¡SUBIÓ DE PUESTO!</span>
                  </motion.div>
                )}

                {movement === 'down' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-3 left-6 z-20 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-500 text-white flex items-center gap-1 shadow-lg shadow-rose-500/30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>BAJÓ DE PUESTO</span>
                  </motion.div>
                )}

                {/* Floating Point Delta Popup Animation (+1 / -1) */}
                <AnimatePresence>
                  {activeAnimation && (
                    <motion.div
                      key={`popup-${activeAnimation.id}`}
                      initial={{ opacity: 0, scale: 0.5, y: 15 }}
                      animate={{ opacity: 1, scale: 1.2, y: -20 }}
                      exit={{ opacity: 0, scale: 0.8, y: -35 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className={`absolute top-2 right-6 z-30 px-3.5 py-1 rounded-2xl text-sm sm:text-base font-black shadow-2xl tracking-wider uppercase flex items-center gap-1.5 ${
                        activeAnimation.delta > 0
                          ? 'bg-emerald-400 text-slate-950 ring-4 ring-emerald-300/50 shadow-emerald-400/50'
                          : 'bg-rose-500 text-white ring-4 ring-rose-300/50 shadow-rose-500/50'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>{activeAnimation.delta > 0 ? '+1' : '-1'}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Top Row: Medal/Rank, Group Name, Keyboard Key & Giant Score */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Medal / Rank Indicator (Big & Prominent) */}
                    <span
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl border flex-shrink-0 shadow-sm ${rankInfo.style}`}
                    >
                      {rankInfo.badge}
                    </span>

                    {/* Group Name & Identity Key */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-black text-xl sm:text-2xl lg:text-3xl tracking-tight truncate ${
                            isLight ? 'text-slate-900' : 'text-white'
                          }`}
                        >
                          GROUP {team.number}
                        </span>

                        <kbd
                          className="px-2 py-0.5 rounded-lg bg-blue-950/80 text-xs sm:text-sm font-mono font-black text-blue-300 border border-blue-500/40 shadow-sm"
                          title={`Presiona tecla ${team.number} para sumar +1 punto`}
                        >
                          {team.number}
                        </kbd>
                      </div>

                      {team.customSubtitle && (
                        <p className="text-xs sm:text-sm font-semibold text-slate-400 truncate max-w-[180px] sm:max-w-[220px] mt-0.5">
                          {team.customSubtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* GIANT SCORE NUMBER (Prominently Enlarged) */}
                  <div className="text-right flex-shrink-0 pl-2">
                    <motion.div
                      key={team.score}
                      initial={{ scale: 1.25, color: '#34d399' }}
                      animate={{ scale: 1, color: isLight ? '#0f172a' : '#ffffff' }}
                      transition={{ duration: 0.4 }}
                      className="text-4xl sm:text-5xl lg:text-6xl font-black tabular-nums tracking-tighter leading-none"
                    >
                      {team.score}
                    </motion.div>
                    <span className="text-[10px] sm:text-xs font-black tracking-[0.25em] uppercase text-slate-400 block mt-1">
                      POINTS
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Manual Discrete Controls (− / +1) */}
                <div className="pt-3 border-t border-inherit flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Manual:
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onAddPoint(team.id, -1)}
                      disabled={team.score <= 0}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 disabled:opacity-25 disabled:cursor-not-allowed text-slate-300 border border-slate-700/60 transition-colors cursor-pointer"
                      title={`Restar 1 punto a GROUP ${team.number} (Shift + ${team.number})`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onAddPoint(team.id, 1)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-black transition-all active:scale-95 cursor-pointer shadow-md shadow-blue-600/30 flex items-center gap-1"
                      title={`Sumar 1 punto a GROUP ${team.number} (Tecla ${team.number})`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+1</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer Reset & Stats */}
      <div className="p-4 border-t border-inherit bg-slate-950/70 flex items-center justify-between text-xs">
        <button
          onClick={() => setShowResetConfirm(true)}
          className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-bold"
        >
          <RotateCcw className="w-4 h-4" />
          <span>RESET SCORE</span>
        </button>

        <span className="text-xs text-slate-400 font-semibold">
          {activeTeams.length} grupos en competencia
        </span>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center text-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="font-black text-xl text-white mb-2">
              Reset all scores?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-6">
              ¿Reiniciar la puntuación de todos los grupos a 0 puntos? La clasificación volverá al orden inicial.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  onResetScores();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm transition-colors cursor-pointer shadow-lg shadow-rose-600/30"
              >
                RESET
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
