/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QUESTIONS } from './data/questions';
import { CATEGORIES } from './data/categories';
import { Question, Team, TextSize, DisplayTheme } from './types';
import { sounds, speakEnglish } from './utils/audio';
import { PresentationHeader } from './components/PresentationHeader';
import { PresentationFooter } from './components/PresentationFooter';
import { SlideView } from './components/SlideView';
import { Scoreboard } from './components/Scoreboard';
import { TeacherModal } from './components/TeacherModal';
import { CompletionScreen } from './components/CompletionScreen';
import { CategoryTransitionBanner } from './components/CategoryTransitionBanner';

const INITIAL_TEAMS: Team[] = [
  { id: 1, name: 'Team 1', score: 0, color: 'bg-blue-500', active: true },
  { id: 2, name: 'Team 2', score: 0, color: 'bg-emerald-500', active: true },
  { id: 3, name: 'Team 3', score: 0, color: 'bg-amber-500', active: true },
  { id: 4, name: 'Team 4', score: 0, color: 'bg-purple-500', active: true },
  { id: 5, name: 'Team 5', score: 0, color: 'bg-rose-500', active: false },
  { id: 6, name: 'Team 6', score: 0, color: 'bg-cyan-500', active: false },
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);
  const [isScoreboardOpen, setIsScoreboardOpen] = useState<boolean>(false);
  const [textSize, setTextSize] = useState<TextSize>('extra-large');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [theme, setTheme] = useState<DisplayTheme>('dark-slate');
  const [teams, setTeams] = useState<Team[]>(() => {
    try {
      const saved = localStorage.getItem('accounting_english_teams');
      return saved ? JSON.parse(saved) : INITIAL_TEAMS;
    } catch {
      return INITIAL_TEAMS;
    }
  });

  const [activeCategoryBanner, setActiveCategoryBanner] = useState<number | null>(null);
  const prevCategoryIdRef = useRef<number>(QUESTIONS[0].categoryId);

  // Save teams in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('accounting_english_teams', JSON.stringify(teams));
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

  const handleReset = useCallback(() => {
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

  // Listen to fullscreen exit from Escape or browser controls
  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsPresentationMode(false);
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

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
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setIsScoreboardOpen((prev) => !prev);
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

  return (
    <div
      className={`min-h-screen w-full flex flex-col justify-between overflow-x-hidden transition-colors duration-200 ${getThemeWrapperClass()}`}
    >
      {/* Category Change Banner */}
      {activeCategoryBanner && currentCategoryInfo && (
        <CategoryTransitionBanner
          category={currentCategoryInfo}
          onDismiss={() => setActiveCategoryBanner(null)}
        />
      )}

      {/* Header */}
      {!isCompleted && currentQuestion && (
        <PresentationHeader
          question={currentQuestion}
          totalQuestions={QUESTIONS.length}
          isPresentationMode={isPresentationMode}
          onTogglePresentationMode={togglePresentationMode}
          onOpenTeacherMode={() => setIsTeacherModalOpen(true)}
          onToggleScoreboard={() => setIsScoreboardOpen((prev) => !prev)}
          isScoreboardOpen={isScoreboardOpen}
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
            onRestart={handleReset}
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

      {/* Team Scoreboard Floating Widget / Drawer */}
      <Scoreboard
        teams={teams}
        setTeams={setTeams}
        isOpen={isScoreboardOpen}
        onToggle={() => setIsScoreboardOpen((prev) => !prev)}
      />

      {/* Teacher Mode Modal */}
      <TeacherModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        questions={QUESTIONS}
        currentIndex={currentIndex}
        onSelectQuestion={handleSelectQuestion}
        onReset={handleReset}
      />
    </div>
  );
}
