import { ModuleInfo } from '../types';
import { CATEGORIES } from './categories';
import { QUESTIONS } from './questions';
import { MODULE_2_CATEGORIES, MODULE_2_QUESTIONS } from './module2';

export const MODULES: ModuleInfo[] = [
  {
    id: 'module-1',
    moduleNumber: 1,
    title: 'GUÍA 5 — CONTABILIDAD',
    fullTitle: 'MÓDULO 1 · GUÍA 5 — CONTABILIDAD',
    badge: '168 SLIDES',
    slideCount: 168,
    description: 'Accounting English — Vocabulario, Adjetivos, Verbos de Acción, TO BE y Presente Simple aplicados al entorno contable.',
    themeColor: 'blue',
    accentGradient: 'from-blue-600 via-indigo-600 to-blue-700',
    categories: CATEGORIES,
    questions: QUESTIONS,
  },
  {
    id: 'module-2',
    moduleNumber: 2,
    title: 'GUÍAS 1–2–3',
    fullTitle: 'MÓDULO 2 · GUÍAS 1–2–3',
    badge: '144 SLIDES',
    slideCount: 144,
    description: 'Basic English — Family, Nationalities, Adjectives, Demonstratives and HAVE (Afirmativo y Negativo).',
    themeColor: 'emerald',
    accentGradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    categories: MODULE_2_CATEGORIES,
    questions: MODULE_2_QUESTIONS,
  },
];

export function getModuleById(id: string): ModuleInfo {
  return MODULES.find((m) => m.id === id) || MODULES[0];
}
