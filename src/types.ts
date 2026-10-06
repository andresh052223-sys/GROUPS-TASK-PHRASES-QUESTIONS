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

export type DisplayTheme = 'dark-slate' | 'high-contrast-dark' | 'bright-projector';
export type TextSize = 'normal' | 'large' | 'extra-large';
