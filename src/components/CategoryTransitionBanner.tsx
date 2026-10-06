import React, { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { CategoryInfo } from '../types';

interface CategoryTransitionBannerProps {
  category: CategoryInfo;
  onDismiss: () => void;
}

export const CategoryTransitionBanner: React.FC<CategoryTransitionBannerProps> = ({
  category,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3200);
    return () => clearTimeout(timer);
  }, [category.id, onDismiss]);

  return (
    <div
      onClick={onDismiss}
      className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-xl w-[90vw] p-4 rounded-2xl bg-slate-900/95 border border-blue-500/50 shadow-2xl backdrop-blur-xl text-center cursor-pointer animate-in fade-in slide-in-from-top-6 duration-300"
    >
      <div className="flex items-center justify-center gap-2 mb-1">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-black tracking-widest uppercase text-blue-400">
          NUEVA CATEGORÍA
        </span>
      </div>
      <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
        {category.name}
      </h3>
      <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
        {category.description}
      </p>
    </div>
  );
};
