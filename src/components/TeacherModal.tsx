import React, { useState } from 'react';
import {
  X,
  Search,
  RotateCcw,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  ListFilter,
  Sparkles,
} from 'lucide-react';
import { Question, CategoryInfo } from '../types';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  categories: CategoryInfo[];
  currentIndex: number;
  onSelectQuestion: (index: number) => void;
  onReset: () => void;
}

export const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  onClose,
  questions,
  categories,
  currentIndex,
  onSelectQuestion,
  onReset,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredQuestions = questions.filter((q) => {
    const matchesCategory =
      selectedCategory === null || q.categoryId === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      q.spanish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toString() === searchQuery.trim();
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Panel del Instructor (Teacher Mode)
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Pregunta {currentIndex + 1} de 100
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Navega a cualquier pregunta, selecciona categorías o reinicia el concurso
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm('¿Seguro que deseas reiniciar la presentación a la Pregunta 1?')) {
                  onReset();
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reiniciar a Pregunta 1</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por palabra en español o inglés, o número de pregunta (1-100)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Clear Category Filter */}
            {selectedCategory !== null && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium cursor-pointer transition-colors"
              >
                <ListFilter className="w-3.5 h-3.5" />
                Ver todas las categorías
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              Todas ({questions.length})
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <span>Cat {cat.id}</span>
                  <span className="text-[10px] opacity-75">
                    ({cat.range[0]}-{cat.range[1]})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Questions Grid / List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">No se encontraron preguntas con los filtros actuales.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {filteredQuestions.map((q, idx) => {
                const questionIndex = q.id - 1;
                const isCurrent = questionIndex === currentIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      onSelectQuestion(questionIndex);
                      onClose();
                    }}
                    className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer group flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-blue-600/20 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                        : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                        isCurrent
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-700 text-slate-300 group-hover:bg-slate-600'
                      }`}
                    >
                      {q.id}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                          Cat {q.categoryId}: {q.categoryTitle}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 flex-shrink-0">
                            Actual
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-sm text-slate-200 group-hover:text-white line-clamp-1">
                        {q.spanish}
                      </p>
                      <p className="text-xs text-slate-400 group-hover:text-slate-300 line-clamp-1 italic">
                        {q.english}
                      </p>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-transform group-hover:translate-x-0.5 flex-shrink-0 mt-2" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <span>Mostrando {filteredQuestions.length} de 100 preguntas</span>
          <span>Presiona <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">T</kbd> para abrir/cerrar</span>
        </div>
      </div>
    </div>
  );
};
