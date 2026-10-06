/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QUESTIONS } from './data/questions';
import { CATEGORIES } from './data/categories';
import { Question, Team, TextSize, DisplayTheme, PointAnimation } from './types';
import { sounds, speakEnglish } from './utils/audio';
import { PresentationHeader } from './components/PresentationHeader';
import { PresentationFooter } from './components/PresentationFooter';
import { SlideView } from './components/SlideView';
import { PermanentScoreboard } from './components/PermanentScoreboard';
import { TeamSetupScreen } from './components/TeamSetupScreen';
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
  const [isSetupMode, setIsSetupMode] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);
  const [textSize, setTextSize] = useState<TextSize>('extra-large');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [theme, setTheme] = useState<DisplayTheme>('dark-slate');
  const [animations, setAnimations] = useState<PointAnimation[]>([]);

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
  const prevCategoryIdRef = useRef<number>(QUESTIONS[0].categoryId);

  // Save teams in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('accounting_english_groups', JSON.stringify(teams));
    } catch {
      // Ignore
    }
  }, [teams]);

  const currentQuestion: Question | undefined = QUESTIONS[currentIndex];
  const isCompleted = currentIndex >= QUESTIONS.length;

  // Detect category change for transition banner
  useEffect(() => {
    if (currentQuestion && currentQuestion.categoryId !== prevCategoryIdRef.current) {
      setActiveCategoryBanner(currentQuestion.categoryId);
      prevCategoryIdRef.current = currentQuestion.categoryId;
    }
  }, [currentQuestion]);

  // Point scoring with animations
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

  // Actions
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
    if (currentIndex < QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsRevealed(false);
    }
  }, [currentIndex]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsRevealed(false);
    }
  }, [currentIndex]);

  const handleSelectQuestion = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsRevealed(false);
  }, []);

  const handleResetChallenge = useCallback(() => {
    setCurrentIndex(0);
    setIsRevealed(false);
    prevCategoryIdRef.current = QUESTIONS[0].categoryId;
  }, []);

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

  const currentCategoryInfo = CATEGORIES.find(
    (c) => c.id === currentQuestion?.categoryId
  );

  // If in initial Setup Mode, show Team Setup Screen first
  if (isSetupMode) {
    return (
      <TeamSetupScreen
        teams={teams}
        setTeams={setTeams}
        onStart={() => setIsSetupMode(false)}
      />
    );
  }

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
        {/* Header */}
        {!isCompleted && currentQuestion && (
          <PresentationHeader
            question={currentQuestion}
            totalQuestions={QUESTIONS.length}
            isPresentationMode={isPresentationMode}
            onTogglePresentationMode={togglePresentationMode}
            onOpenTeacherMode={() => setIsTeacherModalOpen(true)}
            onOpenSetup={() => setIsSetupMode(true)}
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
              totalQuestions={QUESTIONS.length}
              onRestart={handleResetChallenge}
              onReview={() => {
                setCurrentIndex(QUESTIONS.length - 1);
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
            totalQuestions={QUESTIONS.length}
            isRevealed={isRevealed}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onToggleReveal={handleToggleReveal}
            isPresentationMode={isPresentationMode}
          />
        )}
      </div>

      {/* Right Column: Permanent Scoreboard (20%–25% of screen, always visible) */}
      <PermanentScoreboard
        teams={teams}
        onAddPoint={handleAddPoint}
        onResetScores={handleResetScores}
        onOpenSetup={() => setIsSetupMode(true)}
        animations={animations}
        isLight={theme === 'bright-projector'}
      />

      {/* Teacher Mode Modal */}
      <TeacherModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        questions={QUESTIONS}
        currentIndex={currentIndex}
        onSelectQuestion={handleSelectQuestion}
        onReset={handleResetChallenge}
      />
    </div>
  );
}
