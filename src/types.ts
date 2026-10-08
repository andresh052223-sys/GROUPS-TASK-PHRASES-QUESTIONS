export interface VocabularyItem {
  english: string;
  spanish: string;
}

export interface Question {
  id: number;
  categoryId: number;
  categoryName: string;
  categoryTitle: string;
  spanish: string;
  english: string;
  grammarExplanation: string;
  grammarStructure?: string;
  shortAnswers?: string[];
  vocabulary?: VocabularyItem[];
  accountingTip?: string;
}

export interface CategoryInfo {
  id: number;
  title: string;
  name: string;
  range: [number, number];
  description: string;
  color: string;
  badge: string;
}

export interface PointAnimation {
  teamId: number;
  delta: number;
  id: number;
}

export interface Team {
  id: number;
  number: number; // 1, 2, 3, 4, 5, 6
  name: string; // "GROUP 1", "GROUP 2", or custom like "GROUP 1 — THE ACCOUNTANTS"
  customSubtitle?: string;
  score: number;
  color: string;
  active: boolean;
}

export interface ModuleInfo {
  id: string; // 'module-1' | 'module-2'
  moduleNumber: number; // 1 | 2
  title: string; // "GUÍA 5 — CONTABILIDAD" or "GUÍAS 1–2–3"
  fullTitle: string; // "MÓDULO 1 · GUÍA 5 — CONTABILIDAD"
  badge: string; // "168 SLIDES" | "144 SLIDES"
  slideCount: number;
  description: string;
  themeColor: string;
  accentGradient: string;
  categories: CategoryInfo[];
  questions: Question[];
}

export type DisplayTheme = 'dark-slate' | 'high-contrast-dark' | 'bright-projector';
export type TextSize = 'normal' | 'large' | 'extra-large';
