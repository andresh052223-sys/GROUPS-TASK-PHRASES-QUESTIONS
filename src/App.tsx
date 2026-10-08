/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MODULES, getModuleById } from './data/modules';
import { Question, Team, TextSize, DisplayTheme, PointAnimation } from './types';
import { sounds, speakEnglish } from './utils/audio';
import { PresentationHeader } from './components/PresentationHeader';
import { PresentationFooter } from './components/PresentationFooter';
import { SlideView } from './components/SlideView';
import { PermanentScoreboard } from './components/PermanentScoreboard';
import { TeamSetupScreen } from './components/TeamSetupScreen';
import { ModuleSelectionScreen } from './components/ModuleSelectionScreen';
import { TeacherModal } from './components/TeacherModal';
import { CompletionScreen } from './components/CompletionScreen';
import { CategoryTransitionBanner } from './components/CategoryTransitionBanner';

const INITIAL_TEAMS: Team[] = [
  { id: 1, number: 1, name: 'GROUP 1', score: 0, color: 'bg-blue-600', active: true },
  { id: 2, number: 2, name: 'GROUP 2', score: 0, color: 'bg-emerald-600', active: true },
  { id: 3, number: 3, name: 'GROUP 3', score: 0, color: 'bg-amber-600', active: true },
  { id: 4, number: 4, name: 'GROUP 4', score: 0, color: 'bg-purple-600', active: true },
  { id: 5, number: 5, name: 'GROUP 5', score: 0, color: 'bg-rose-600', active: false },
  { id: 6, number: 6, name: 'GROUP 6', score: 0, color: 'bg-cyan-600', active: false },
];

export default function App() {
  // Screen and Module State
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [isTeamSetupOpen, setIsTeamSetupOpen] = useState<boolean>(false);

  // Independent slide progress per module (Module 1 has 168 slides, Module 2 has 144 slides)
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('english_classroom_module_progress');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return { 'module-1': 0, 'module-2': 0 };
  });

  // Presentation State
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);
  const [textSize, setTextSize] = useState<TextSize>('extra-large');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [theme, setTheme] = useState<DisplayTheme>('dark-slate');
  const [animations, setAnimations] = useState<PointAnimation[]>([]);

  // Shared Teams State across all modules
  const [teams, setTeams] = useState<Team[]>(() => {
    try {
      const saved = localStorage.getItem('accounting_english_groups');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_TEAMS;
  });

  const [activeCategoryBanner, setActiveCategoryBanner] = useState<number | null>(null);
  const prevCategoryIdRef = useRef<number>(1);

  // Save teams in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('accounting_english_groups', JSON.stringify(teams));
    } catch {
      // Ignore
    }
  }, [teams]);

  // Save module progress in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        'english_classroom_module_progress',
        JSON.stringify(moduleProgress)
      );
    } catch {
      // Ignore
    }
  }, [moduleProgress]);

  // Current active module data
  const currentModule = selectedModuleId ? getModuleById(selectedModuleId) : null;
  const questions = currentModule ? currentModule.questions : [];
  const categories = currentModule ? currentModule.categories : [];
  const currentIndex = selectedModuleId ? moduleProgress[selectedModuleId] || 0 : 0;
  const currentQuestion: Question | undefined = questions[currentIndex];
  const isCompleted = currentModule ? currentIndex >= questions.length : false;

  // Set current index for the active module
  const setCurrentIndex = useCallback(
    (newIndex: number | ((prev: number) => number)) => {
      if (!selectedModuleId) return;
      setModuleProgress((prev) => {
        const current = prev[selectedModuleId] || 0;
        const next = typeof newIndex === 'function' ? newIndex(current) : newIndex;
        return {
          ...prev,
          [selectedModuleId]: Math.max(0, next),
        };
      });
    },
    [selectedModuleId]
  );

  // Detect category change for transition banner
  useEffect(() => {
    if (currentQuestion && currentQuestion.categoryId !== prevCategoryIdRef.current) {
      setActiveCategoryBanner(currentQuestion.categoryId);
      prevCategoryIdRef.current = currentQuestion.categoryId;
    }
  }, [currentQuestion]);

  // Point scoring with animations (1–6 keys and Shift+1–6)
  const handleAddPoint = useCallback((teamId: number, delta: number) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          const nextScore = Math.max(0, t.score + delta);
          return { ...t, score: nextScore };
        }
        return t;
      })
    );

    sounds.playPoint(delta > 0);

    const animId = Date.now() + Math.random();
    setAnimations((prev) => [...prev, { teamId, delta, id: animId }]);
    setTimeout(() => {
      setAnimations((prev) => prev.filter((a) => a.id !== animId));
    }, 1100);
  }, []);

  const handleResetScores = useCallback(() => {
    setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
    sounds.playPoint(false);
  }, []);

  // Slide Actions
  const handleReveal = useCallback(() => {
    if (!isRevealed) {
      sounds.playReveal();
      setIsRevealed(true);
    }
  }, [isRevealed]);

  const handleToggleReveal = useCallback(() => {
    if (!isRevealed) {
      sounds.playReveal();
      setIsRevealed(true);
    } else {
      setIsRevealed(false);
    }
  }, [isRevealed]);

  const handleNext = useCallback(() => {
    if (currentModule && currentIndex < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsRevealed(false);
    }
  }, [currentModule, currentIndex, questions.length, setCurrentIndex]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsRevealed(false);
    }
  }, [currentIndex, setCurrentIndex]);

  const handleSelectQuestion = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      setIsRevealed(false);
    },
    [setCurrentIndex]
  );

  const handleResetModuleChallenge = useCallback(() => {
    setCurrentIndex(0);
    setIsRevealed(false);
    prevCategoryIdRef.current = 1;
  }, [setCurrentIndex]);

  const togglePresentationMode = useCallback(() => {
    setIsPresentationMode((prev) => {
      const next = !prev;
      if (next) {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
      return next;
    });
  }, []);

  // Listen to fullscreen exit
  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsPresentationMode(false);
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Global Keyboard Navigation & Point Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Check number keys 1–6 (both main number row and numpad)
      const digitMatch = e.code.match(/^(Digit|Numpad)([1-6])$/);
      const keyNum = digitMatch
        ? parseInt(digitMatch[2], 10)
        : ['1', '2', '3', '4', '5', '6'].includes(e.key)
        ? parseInt(e.key, 10)
        : null;

      if (keyNum !== null && keyNum >= 1 && keyNum <= 6) {
        const targetTeam = teams.find((t) => t.number === keyNum && t.active);
        if (targetTeam) {
          e.preventDefault();
          if (e.shiftKey) {
            handleAddPoint(targetTeam.id, -1);
          } else {
            handleAddPoint(targetTeam.id, 1);
          }
          return;
        }
      }

      // If we are on the module selection screen, don't execute slide navigation
      if (!selectedModuleId) {
        return;
      }

      // Standard presentation controls
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handleToggleReveal();
      } else if (e.key === 'ArrowRight' || e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        togglePresentationMode();
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setIsTeacherModalOpen((prev) => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setSelectedModuleId(null);
      } else if (e.key === 's' || e.key === 'S') {
        if (isRevealed && currentQuestion) {
          e.preventDefault();
          speakEnglish(currentQuestion.english);
        }
      } else if (e.key === 'Escape') {
        if (isTeacherModalOpen) {
          setIsTeacherModalOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    teams,
    selectedModuleId,
    handleAddPoint,
    handleToggleReveal,
    handleNext,
    handlePrevious,
    togglePresentationMode,
    isRevealed,
    currentQuestion,
    isTeacherModalOpen,
  ]);

  // Theme styling
  const getThemeWrapperClass = () => {
    switch (theme) {
      case 'high-contrast-dark':
        return 'bg-black text-white selection:bg-emerald-500 selection:text-black';
      case 'bright-projector':
        return 'bg-slate-100 text-slate-900 selection:bg-blue-600 selection:text-white';
      case 'dark-slate':
      default:
        return 'bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white';
    }
  };

  const currentCategoryInfo = categories.find(
    (c) => c.id === currentQuestion?.categoryId
  );

  // VIEW 1: Team Setup Screen (Configuración de grupos)
  if (isTeamSetupOpen) {
    return (
      <TeamSetupScreen
        teams={teams}
        setTeams={setTeams}
        onStart={() => setIsTeamSetupOpen(false)}
      />
    );
  }

  // VIEW 2: Initial Home Screen — Module Selection (ENGLISH CLASSROOM — SELECT A MODULE)
  if (!selectedModuleId || !currentModule) {
    return (
      <ModuleSelectionScreen
        onSelectModule={(modId) => {
          setSelectedModuleId(modId);
          setIsRevealed(false);
        }}
        moduleProgress={moduleProgress}
        teams={teams}
        onOpenTeamSetup={() => setIsTeamSetupOpen(true)}
      />
    );
  }

  // VIEW 3: Module Presentation with Permanent Scoreboard
  return (
    <div
      className={`min-h-screen w-full flex flex-col lg:flex-row overflow-x-hidden transition-colors duration-200 ${getThemeWrapperClass()}`}
    >
      {/* Category Change Announcement Toast */}
      {activeCategoryBanner && currentCategoryInfo && (
        <CategoryTransitionBanner
          category={currentCategoryInfo}
          onDismiss={() => setActiveCategoryBanner(null)}
        />
      )}

      {/* Main Presentation Column (68%–72% of screen) */}
      <div className="flex-1 lg:max-w-[72vw] xl:max-w-[70vw] 2xl:max-w-[68vw] flex flex-col justify-between min-w-0 h-screen overflow-y-auto">
        {/* Header with Modules button, Module title, and progress */}
        {!isCompleted && currentQuestion && (
          <PresentationHeader
            question={currentQuestion}
            totalQuestions={questions.length}
            moduleTitle={currentModule.fullTitle}
            isPresentationMode={isPresentationMode}
            onTogglePresentationMode={togglePresentationMode}
            onOpenTeacherMode={() => setIsTeacherModalOpen(true)}
            onOpenSetup={() => setIsTeamSetupOpen(true)}
            onOpenModules={() => {
              setSelectedModuleId(null);
              setIsRevealed(false);
            }}
            textSize={textSize}
            onChangeTextSize={setTextSize}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
            theme={theme}
            onChangeTheme={setTheme}
          />
        )}

        {/* Main Slide / Completion Content */}
        <main className="flex-1 flex flex-col justify-center items-center w-full relative">
          {isCompleted ? (
            <CompletionScreen
              teams={teams}
              totalQuestions={questions.length}
              onRestart={handleResetModuleChallenge}
              onReview={() => {
                setCurrentIndex(questions.length - 1);
                setIsRevealed(true);
              }}
            />
          ) : (
            currentQuestion && (
              <SlideView
                question={currentQuestion}
                isRevealed={isRevealed}
                onReveal={handleReveal}
                onNext={handleNext}
                textSize={textSize}
                theme={theme}
              />
            )
          )}
        </main>

        {/* Footer Navigation */}
        {!isCompleted && (
          <PresentationFooter
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            isRevealed={isRevealed}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onToggleReveal={handleToggleReveal}
            isPresentationMode={isPresentationMode}
          />
        )}
      </div>

      {/* Right Column: Permanent Scoreboard (28%–32% of screen, shared across modules) */}
      <PermanentScoreboard
        teams={teams}
        onAddPoint={handleAddPoint}
        onResetScores={handleResetScores}
        onOpenSetup={() => setIsTeamSetupOpen(true)}
        animations={animations}
        isLight={theme === 'bright-projector'}
      />

      {/* Teacher Mode Modal (Dynamic per module) */}
      <TeacherModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        questions={questions}
        categories={categories}
        currentIndex={currentIndex}
        onSelectQuestion={handleSelectQuestion}
        onReset={handleResetModuleChallenge}
      />
    </div>
  );
}
